'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.InMemorySpanExporter = undefined;

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
 * This class can be used for testing purposes. It stores the exported spans
 * in a list in memory that can be retrieved using the `getFinishedSpans()`
 * method.
 */
var InMemorySpanExporter = exports.InMemorySpanExporter = function () {
    function InMemorySpanExporter() {
        _classCallCheck(this, InMemorySpanExporter);

        this._finishedSpans = [];
        /**
         * Indicates if the exporter has been "shutdown."
         * When false, exported spans will not be stored in-memory.
         */
        this._stopped = false;
    }

    _createClass(InMemorySpanExporter, [{
        key: 'export',
        value: function _export(spans, resultCallback) {
            var _finishedSpans;

            if (this._stopped) return resultCallback({
                code: _core.ExportResultCode.FAILED,
                error: new Error('Exporter has been stopped')
            });
            (_finishedSpans = this._finishedSpans).push.apply(_finishedSpans, _toConsumableArray(spans));
            setTimeout(function () {
                return resultCallback({ code: _core.ExportResultCode.SUCCESS });
            }, 0);
        }
    }, {
        key: 'shutdown',
        value: function shutdown() {
            this._stopped = true;
            this._finishedSpans = [];
            return this.forceFlush();
        }
        /**
         * Exports any pending spans in the exporter
         */

    }, {
        key: 'forceFlush',
        value: function forceFlush() {
            return Promise.resolve();
        }
    }, {
        key: 'reset',
        value: function reset() {
            this._finishedSpans = [];
        }
    }, {
        key: 'getFinishedSpans',
        value: function getFinishedSpans() {
            return this._finishedSpans;
        }
    }]);

    return InMemorySpanExporter;
}();
//# sourceMappingURL=InMemorySpanExporter.js.map