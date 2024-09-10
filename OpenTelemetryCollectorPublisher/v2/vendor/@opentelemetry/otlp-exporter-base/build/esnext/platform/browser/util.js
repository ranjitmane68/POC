'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /*
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


exports.sendWithBeacon = sendWithBeacon;
exports.sendWithXhr = sendWithXhr;

var _api = require('@opentelemetry/api');

var _types = require('../../types');

var _util = require('../../util');

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
        _api.diag.debug('sendBeacon - can send', body);
        onSuccess();
    } else {
        var error = new _types.OTLPExporterError('sendBeacon - cannot send ' + body);
        onError(error);
    }
}
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
            var err = new _types.OTLPExporterError('Request Timeout');
            onError(err);
        } else {
            xhr.abort();
        }
    }, exporterTimeout);
    var sendWithRetry = function sendWithRetry() {
        var retries = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _util.DEFAULT_EXPORT_MAX_ATTEMPTS;
        var minDelay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _util.DEFAULT_EXPORT_INITIAL_BACKOFF;

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
                    _api.diag.debug('xhr success', body);
                    onSuccess();
                    clearTimeout(exporterTimer);
                    clearTimeout(retryTimer);
                } else if (xhr.status && (0, _util.isExportRetryable)(xhr.status) && retries > 0) {
                    var retryTime = void 0;
                    minDelay = _util.DEFAULT_EXPORT_BACKOFF_MULTIPLIER * minDelay;
                    // retry after interval specified in Retry-After header
                    if (xhr.getResponseHeader('Retry-After')) {
                        retryTime = (0, _util.parseRetryAfterToMills)(xhr.getResponseHeader('Retry-After'));
                    } else {
                        // exponential backoff with jitter
                        retryTime = Math.round(Math.random() * (_util.DEFAULT_EXPORT_MAX_BACKOFF - minDelay) + minDelay);
                    }
                    retryTimer = setTimeout(function () {
                        sendWithRetry(retries - 1, minDelay);
                    }, retryTime);
                } else {
                    var error = new _types.OTLPExporterError('Failed to export with XHR (status: ' + xhr.status + ')', xhr.status);
                    onError(error);
                    clearTimeout(exporterTimer);
                    clearTimeout(retryTimer);
                }
            }
        };
        xhr.onabort = function () {
            if (reqIsDestroyed) {
                var err = new _types.OTLPExporterError('Request Timeout');
                onError(err);
            }
            clearTimeout(exporterTimer);
            clearTimeout(retryTimer);
        };
        xhr.onerror = function () {
            if (reqIsDestroyed) {
                var err = new _types.OTLPExporterError('Request Timeout');
                onError(err);
            }
            clearTimeout(exporterTimer);
            clearTimeout(retryTimer);
        };
    };
    sendWithRetry();
}
//# sourceMappingURL=util.js.map