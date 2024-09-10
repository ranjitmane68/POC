'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.InMemoryLogRecordExporter = undefined;

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

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * This class can be used for testing purposes. It stores the exported LogRecords
 * in a list in memory that can be retrieved using the `getFinishedLogRecords()`
 * method.
 */
var InMemoryLogRecordExporter = exports.InMemoryLogRecordExporter = function () {
    function InMemoryLogRecordExporter() {
        _classCallCheck(this, InMemoryLogRecordExporter);

        this._finishedLogRecords = [];
        /**
         * Indicates if the exporter has been "shutdown."
         * When false, exported log records will not be stored in-memory.
         */
        this._stopped = false;
    }

    _createClass(InMemoryLogRecordExporter, [{
        key: 'export',
        value: function _export(logs, resultCallback) {
            var _finishedLogRecords;

            if (this._stopped) {
                return resultCallback({
                    code: _core.ExportResultCode.FAILED,
                    error: new Error('Exporter has been stopped')
                });
            }
            (_finishedLogRecords = this._finishedLogRecords).push.apply(_finishedLogRecords, _toConsumableArray(logs));
            resultCallback({ code: _core.ExportResultCode.SUCCESS });
        }
    }, {
        key: 'shutdown',
        value: function shutdown() {
            this._stopped = true;
            this.reset();
            return Promise.resolve();
        }
    }, {
        key: 'getFinishedLogRecords',
        value: function getFinishedLogRecords() {
            return this._finishedLogRecords;
        }
    }, {
        key: 'reset',
        value: function reset() {
            this._finishedLogRecords = [];
        }
    }]);

    return InMemoryLogRecordExporter;
}();
//# sourceMappingURL=InMemoryLogRecordExporter.js.map