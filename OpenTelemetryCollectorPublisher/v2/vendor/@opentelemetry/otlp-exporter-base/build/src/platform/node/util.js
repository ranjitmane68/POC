"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.configureCompression = exports.createHttpAgent = exports.sendWithHttp = void 0;
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var url = require("url");
var http = require("http");
var https = require("https");
var zlib = require("zlib");
var stream_1 = require("stream");
var api_1 = require("@opentelemetry/api");
var types_1 = require("./types");
var core_1 = require("@opentelemetry/core");
var types_2 = require("../../types");
var util_1 = require("../../util");
/**
 * Sends data using http
 * @param collector
 * @param data
 * @param contentType
 * @param onSuccess
 * @param onError
 */
function sendWithHttp(collector, data, contentType, onSuccess, onError) {
    var exporterTimeout = collector.timeoutMillis;
    var parsedUrl = new url.URL(collector.url);
    var nodeVersion = Number(process.versions.node.split('.')[0]);
    var retryTimer = void 0;
    var req = void 0;
    var reqIsDestroyed = false;
    var exporterTimer = setTimeout(function () {
        clearTimeout(retryTimer);
        reqIsDestroyed = true;
        if (req.destroyed) {
            var err = new types_2.OTLPExporterError('Request Timeout');
            onError(err);
        } else {
            // req.abort() was deprecated since v14
            nodeVersion >= 14 ? req.destroy() : req.abort();
        }
    }, exporterTimeout);
    var options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.pathname,
        method: 'POST',
        headers: Object.assign({ 'Content-Type': contentType }, collector.headers),
        agent: collector.agent
    };
    var request = parsedUrl.protocol === 'http:' ? http.request : https.request;
    var sendWithRetry = function sendWithRetry() {
        var retries = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : util_1.DEFAULT_EXPORT_MAX_ATTEMPTS;
        var minDelay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : util_1.DEFAULT_EXPORT_INITIAL_BACKOFF;

        req = request(options, function (res) {
            var responseData = '';
            res.on('data', function (chunk) {
                return responseData += chunk;
            });
            res.on('aborted', function () {
                if (reqIsDestroyed) {
                    var err = new types_2.OTLPExporterError('Request Timeout');
                    onError(err);
                }
            });
            res.on('end', function () {
                if (reqIsDestroyed === false) {
                    if (res.statusCode && res.statusCode < 299) {
                        api_1.diag.debug("statusCode: " + res.statusCode, responseData);
                        onSuccess();
                        // clear all timers since request was completed and promise was resolved
                        clearTimeout(exporterTimer);
                        clearTimeout(retryTimer);
                    } else if (res.statusCode && (0, util_1.isExportRetryable)(res.statusCode) && retries > 0) {
                        var retryTime = void 0;
                        minDelay = util_1.DEFAULT_EXPORT_BACKOFF_MULTIPLIER * minDelay;
                        // retry after interval specified in Retry-After header
                        if (res.headers['retry-after']) {
                            retryTime = (0, util_1.parseRetryAfterToMills)(res.headers['retry-after']);
                        } else {
                            // exponential backoff with jitter
                            retryTime = Math.round(Math.random() * (util_1.DEFAULT_EXPORT_MAX_BACKOFF - minDelay) + minDelay);
                        }
                        retryTimer = setTimeout(function () {
                            sendWithRetry(retries - 1, minDelay);
                        }, retryTime);
                    } else {
                        var error = new types_2.OTLPExporterError(res.statusMessage, res.statusCode, responseData);
                        onError(error);
                        // clear all timers since request was completed and promise was resolved
                        clearTimeout(exporterTimer);
                        clearTimeout(retryTimer);
                    }
                }
            });
        });
        req.on('error', function (error) {
            if (reqIsDestroyed) {
                var err = new types_2.OTLPExporterError('Request Timeout', error.code);
                onError(err);
            } else {
                onError(error);
            }
            clearTimeout(exporterTimer);
            clearTimeout(retryTimer);
        });
        req.on('abort', function () {
            if (reqIsDestroyed) {
                var err = new types_2.OTLPExporterError('Request Timeout');
                onError(err);
            }
            clearTimeout(exporterTimer);
            clearTimeout(retryTimer);
        });
        switch (collector.compression) {
            case types_1.CompressionAlgorithm.GZIP:
                {
                    req.setHeader('Content-Encoding', 'gzip');
                    var dataStream = readableFromUnit8Array(data);
                    dataStream.on('error', onError).pipe(zlib.createGzip()).on('error', onError).pipe(req);
                    break;
                }
            default:
                req.end(Buffer.from(data));
                break;
        }
    };
    sendWithRetry();
}
exports.sendWithHttp = sendWithHttp;
function readableFromUnit8Array(buff) {
    var readable = new stream_1.Readable();
    readable.push(buff);
    readable.push(null);
    return readable;
}
function createHttpAgent(config) {
    if (config.httpAgentOptions && config.keepAlive === false) {
        api_1.diag.warn('httpAgentOptions is used only when keepAlive is true');
        return undefined;
    }
    if (config.keepAlive === false || !config.url) return undefined;
    try {
        var parsedUrl = new url.URL(config.url);
        var Agent = parsedUrl.protocol === 'http:' ? http.Agent : https.Agent;
        return new Agent(Object.assign({ keepAlive: true }, config.httpAgentOptions));
    } catch (err) {
        api_1.diag.error("collector exporter failed to create http agent. err: " + err.message);
        return undefined;
    }
}
exports.createHttpAgent = createHttpAgent;
function configureCompression(compression) {
    if (compression) {
        return compression;
    } else {
        var definedCompression = (0, core_1.getEnv)().OTEL_EXPORTER_OTLP_TRACES_COMPRESSION || (0, core_1.getEnv)().OTEL_EXPORTER_OTLP_COMPRESSION;
        return definedCompression === types_1.CompressionAlgorithm.GZIP ? types_1.CompressionAlgorithm.GZIP : types_1.CompressionAlgorithm.NONE;
    }
}
exports.configureCompression = configureCompression;
//# sourceMappingURL=util.js.map