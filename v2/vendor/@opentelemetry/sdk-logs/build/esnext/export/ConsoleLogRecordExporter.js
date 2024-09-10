'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ConsoleLogRecordExporter = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
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


var _core = require('@opentelemetry/core');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * This is implementation of {@link LogRecordExporter} that prints LogRecords to the
 * console. This class can be used for diagnostic purposes.
 */
/* eslint-disable no-console */
var ConsoleLogRecordExporter = exports.ConsoleLogRecordExporter = function () {
    function ConsoleLogRecordExporter() {
        _classCallCheck(this, ConsoleLogRecordExporter);
    }

    _createClass(ConsoleLogRecordExporter, [{
        key: 'export',

        /**
         * Export logs.
         * @param logs
         * @param resultCallback
         */
        value: function _export(logs, resultCallback) {
            this._sendLogRecords(logs, resultCallback);
        }
        /**
         * Shutdown the exporter.
         */

    }, {
        key: 'shutdown',
        value: function shutdown() {
            return Promise.resolve();
        }
        /**
         * converts logRecord info into more readable format
         * @param logRecord
         */

    }, {
        key: '_exportInfo',
        value: function _exportInfo(logRecord) {
            var _a, _b, _c;
            return {
                resource: {
                    attributes: logRecord.resource.attributes
                },
                timestamp: (0, _core.hrTimeToMicroseconds)(logRecord.hrTime),
                traceId: (_a = logRecord.spanContext) === null || _a === void 0 ? void 0 : _a.traceId,
                spanId: (_b = logRecord.spanContext) === null || _b === void 0 ? void 0 : _b.spanId,
                traceFlags: (_c = logRecord.spanContext) === null || _c === void 0 ? void 0 : _c.traceFlags,
                severityText: logRecord.severityText,
                severityNumber: logRecord.severityNumber,
                body: logRecord.body,
                attributes: logRecord.attributes
            };
        }
        /**
         * Showing logs  in console
         * @param logRecords
         * @param done
         */

    }, {
        key: '_sendLogRecords',
        value: function _sendLogRecords(logRecords, done) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = logRecords[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var logRecord = _step.value;

                    console.dir(this._exportInfo(logRecord), { depth: 3 });
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            done === null || done === void 0 ? void 0 : done({ code: _core.ExportResultCode.SUCCESS });
        }
    }]);

    return ConsoleLogRecordExporter;
}();
//# sourceMappingURL=ConsoleLogRecordExporter.js.map