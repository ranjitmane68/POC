'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.InMemoryMetricExporter = undefined;

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
 * In-memory Metrics Exporter is a Push Metric Exporter
 * which accumulates metrics data in the local memory and
 * allows to inspect it (useful for e.g. unit tests).
 */
var InMemoryMetricExporter = exports.InMemoryMetricExporter = function () {
    function InMemoryMetricExporter(aggregationTemporality) {
        _classCallCheck(this, InMemoryMetricExporter);

        this._shutdown = false;
        this._metrics = [];
        this._aggregationTemporality = aggregationTemporality;
    }
    /**
     * @inheritedDoc
     */


    _createClass(InMemoryMetricExporter, [{
        key: 'export',
        value: function _export(metrics, resultCallback) {
            // Avoid storing metrics when exporter is shutdown
            if (this._shutdown) {
                setTimeout(function () {
                    return resultCallback({ code: _core.ExportResultCode.FAILED });
                }, 0);
                return;
            }
            this._metrics.push(metrics);
            setTimeout(function () {
                return resultCallback({ code: _core.ExportResultCode.SUCCESS });
            }, 0);
        }
        /**
         * Returns all the collected resource metrics
         * @returns ResourceMetrics[]
         */

    }, {
        key: 'getMetrics',
        value: function getMetrics() {
            return this._metrics;
        }
    }, {
        key: 'forceFlush',
        value: function forceFlush() {
            return Promise.resolve();
        }
    }, {
        key: 'reset',
        value: function reset() {
            this._metrics = [];
        }
    }, {
        key: 'selectAggregationTemporality',
        value: function selectAggregationTemporality(_instrumentType) {
            return this._aggregationTemporality;
        }
    }, {
        key: 'shutdown',
        value: function shutdown() {
            this._shutdown = true;
            return Promise.resolve();
        }
    }]);

    return InMemoryMetricExporter;
}();
//# sourceMappingURL=InMemoryMetricExporter.js.map