'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ConsoleMetricExporter = undefined;

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

var _AggregationSelector = require('./AggregationSelector');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint-disable no-console */
var ConsoleMetricExporter = exports.ConsoleMetricExporter = function () {
    function ConsoleMetricExporter(options) {
        _classCallCheck(this, ConsoleMetricExporter);

        var _a;
        this._shutdown = false;
        this._temporalitySelector = (_a = options === null || options === void 0 ? void 0 : options.temporalitySelector) !== null && _a !== void 0 ? _a : _AggregationSelector.DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR;
    }

    _createClass(ConsoleMetricExporter, [{
        key: 'export',
        value: function _export(metrics, resultCallback) {
            if (this._shutdown) {
                // If the exporter is shutting down, by spec, we need to return FAILED as export result
                setImmediate(resultCallback, { code: _core.ExportResultCode.FAILED });
                return;
            }
            return ConsoleMetricExporter._sendMetrics(metrics, resultCallback);
        }
    }, {
        key: 'forceFlush',
        value: function forceFlush() {
            return Promise.resolve();
        }
    }, {
        key: 'selectAggregationTemporality',
        value: function selectAggregationTemporality(_instrumentType) {
            return this._temporalitySelector(_instrumentType);
        }
    }, {
        key: 'shutdown',
        value: function shutdown() {
            this._shutdown = true;
            return Promise.resolve();
        }
    }], [{
        key: '_sendMetrics',
        value: function _sendMetrics(metrics, done) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = metrics.scopeMetrics[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var scopeMetrics = _step.value;
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = scopeMetrics.metrics[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var metric = _step2.value;

                            console.dir({
                                descriptor: metric.descriptor,
                                dataPointType: metric.dataPointType,
                                dataPoints: metric.dataPoints
                            }, { depth: null });
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }
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

            done({ code: _core.ExportResultCode.SUCCESS });
        }
    }]);

    return ConsoleMetricExporter;
}();
//# sourceMappingURL=ConsoleMetricExporter.js.map