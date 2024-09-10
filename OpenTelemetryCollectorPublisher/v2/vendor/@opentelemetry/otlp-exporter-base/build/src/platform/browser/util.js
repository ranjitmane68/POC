"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWithXhr = exports.sendWithBeacon = void 0;
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
var api_1 = require("@opentelemetry/api");
var types_1 = require("../../types");
var util_1 = require("../../util");
/**
 * Send metrics/spans using browser navigator.sendBeacon
 * @param body
 * @param url
 * @param blobPropertyBag
 * @param onSuccess
 * @param onError
 */
function sendWithBeacon(body, url, blobPropertyBag, onSuccess, onError) {
    if (navigator.sendBeacon(url, new Blob([body], blobPropertyBag))) {
        api_1.diag.debug('sendBeacon - can send', body);
        onSuccess();
    } else {
        var error = new types_1.OTLPExporterError("sendBeacon - cannot send " + body);
        onError(error);
    }
}
exports.sendWithBeacon = sendWithBeacon;
/**
 * function to send metrics/spans using browser XMLHttpRequest
 *     used when navigator.sendBeacon is not available
 * @param body
 * @param url
 * @param headers
 * @param onSuccess
 * @param onError
 */
function sendWithXhr(body, url, headers, exporterTimeout, onSuccess, onError) {
    var retryTimer = void 0;
    var xhr = void 0;
    var reqIsDestroyed = false;
    var exporterTimer = setTimeout(function () {
        clearTimeout(retryTimer);
        reqIsDestroyed = true;
        if (xhr.readyState === XMLHttpRequest.DONE) {
            var err = new types_1.OTLPExporterError('Request Timeout');
            onError(err);
        } else {
            xhr.abort();
        }
    }, exporterTimeout);
    var sendWithRetry = function sendWithRetry() {
        var retries = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : util_1.DEFAULT_EXPORT_MAX_ATTEMPTS;
        var minDelay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : util_1.DEFAULT_EXPORT_INITIAL_BACKOFF;

        xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        var defaultHeaders = {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        };
        Object.entries(Object.assign(Object.assign({}, defaultHeaders), headers)).forEach(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                k = _ref2[0],
                v = _ref2[1];

            xhr.setRequestHeader(k, v);
        });
        xhr.send(body);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE && reqIsDestroyed === false) {
                if (xhr.status >= 200 && xhr.status <= 299) {
                    api_1.diag.debug('xhr success', body);
                    onSuccess();
                    clearTimeout(exporterTimer);
                    clearTimeout(retryTimer);
                } else if (xhr.status && (0, util_1.isExportRetryable)(xhr.status) && retries > 0) {
                    var retryTime = void 0;
                    minDelay = util_1.DEFAULT_EXPORT_BACKOFF_MULTIPLIER * minDelay;
                    // retry after interval specified in Retry-After header
                    if (xhr.getResponseHeader('Retry-After')) {
                        retryTime = (0, util_1.parseRetryAfterToMills)(xhr.getResponseHeader('Retry-After'));
                    } else {
                        // exponential backoff with jitter
                        retryTime = Math.round(Math.random() * (util_1.DEFAULT_EXPORT_MAX_BACKOFF - minDelay) + minDelay);
                    }
                    retryTimer = setTimeout(function () {
                        sendWithRetry(retries - 1, minDelay);
                    }, retryTime);
                } else {
                    var error = new types_1.OTLPExporterError("Failed to export with XHR (status: " + xhr.status + ")", xhr.status);
                    onError(error);
                    clearTimeout(exporterTimer);
                    clearTimeout(retryTimer);
                }
            }
        };
        xhr.onabort = function () {
            if (reqIsDestroyed) {
                var err = new types_1.OTLPExporterError('Request Timeout');
                onError(err);
            }
            clearTimeout(exporterTimer);
            clearTimeout(retryTimer);
        };
        xhr.onerror = function () {
            if (reqIsDestroyed) {
                var err = new types_1.OTLPExporterError('Request Timeout');
                onError(err);
            }
            clearTimeout(exporterTimer);
            clearTimeout(retryTimer);
        };
    };
    sendWithRetry();
}
exports.sendWithXhr = sendWithXhr;
//# sourceMappingURL=util.js.map