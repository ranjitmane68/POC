'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TemporalMetricProcessor = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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


var _AggregationTemporality = require('../export/AggregationTemporality');

var _HashMap = require('./HashMap');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Internal interface.
 *
 * Provides unique reporting for each collector. Allows synchronous collection
 * of metrics and reports given temporality values.
 */
var TemporalMetricProcessor = exports.TemporalMetricProcessor = function () {
    function TemporalMetricProcessor(_aggregator, collectorHandles) {
        var _this = this;

        _classCallCheck(this, TemporalMetricProcessor);

        this._aggregator = _aggregator;
        this._unreportedAccumulations = new Map();
        this._reportHistory = new Map();
        collectorHandles.forEach(function (handle) {
            _this._unreportedAccumulations.set(handle, []);
        });
    }
    /**
     * Builds the {@link MetricData} streams to report against a specific MetricCollector.
     * @param collector The information of the MetricCollector.
     * @param collectors The registered collectors.
     * @param instrumentDescriptor The instrumentation descriptor that these metrics generated with.
     * @param currentAccumulations The current accumulation of metric data from instruments.
     * @param collectionTime The current collection timestamp.
     * @returns The {@link MetricData} points or `null`.
     */


    _createClass(TemporalMetricProcessor, [{
        key: 'buildMetrics',
        value: function buildMetrics(collector, instrumentDescriptor, currentAccumulations, collectionTime) {
            this._stashAccumulations(currentAccumulations);
            var unreportedAccumulations = this._getMergedUnreportedAccumulations(collector);
            var result = unreportedAccumulations;
            var aggregationTemporality = void 0;
            // Check our last report time.
            if (this._reportHistory.has(collector)) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                var last = this._reportHistory.get(collector);
                var lastCollectionTime = last.collectionTime;
                aggregationTemporality = last.aggregationTemporality;
                // Use aggregation temporality + instrument to determine if we do a merge or a diff of
                // previous. We have the following four scenarios:
                // 1. Cumulative Aggregation (temporality) + Delta recording (sync instrument).
                //    Here we merge with our last record to get a cumulative aggregation.
                // 2. Cumulative Aggregation + Cumulative recording (async instrument).
                //    Cumulative records are converted to delta recording with DeltaMetricProcessor.
                //    Here we merge with our last record to get a cumulative aggregation.
                // 3. Delta Aggregation + Delta recording
                //    Calibrate the startTime of metric streams to be the reader's lastCollectionTime.
                // 4. Delta Aggregation + Cumulative recording.
                //    Cumulative records are converted to delta recording with DeltaMetricProcessor.
                //    Calibrate the startTime of metric streams to be the reader's lastCollectionTime.
                if (aggregationTemporality === _AggregationTemporality.AggregationTemporality.CUMULATIVE) {
                    // We need to make sure the current delta recording gets merged into the previous cumulative
                    // for the next cumulative recording.
                    result = TemporalMetricProcessor.merge(last.accumulations, unreportedAccumulations, this._aggregator);
                } else {
                    result = TemporalMetricProcessor.calibrateStartTime(last.accumulations, unreportedAccumulations, lastCollectionTime);
                }
            } else {
                // Call into user code to select aggregation temporality for the instrument.
                aggregationTemporality = collector.selectAggregationTemporality(instrumentDescriptor.type);
            }
            // Update last reported (cumulative) accumulation.
            this._reportHistory.set(collector, {
                accumulations: result,
                collectionTime: collectionTime,
                aggregationTemporality: aggregationTemporality
            });
            var accumulationRecords = AttributesMapToAccumulationRecords(result);
            // do not convert to metric data if there is nothing to convert.
            if (accumulationRecords.length === 0) {
                return undefined;
            }
            return this._aggregator.toMetricData(instrumentDescriptor, aggregationTemporality, accumulationRecords,
            /* endTime */collectionTime);
        }
    }, {
        key: '_stashAccumulations',
        value: function _stashAccumulations(currentAccumulation) {
            var registeredCollectors = this._unreportedAccumulations.keys();
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = registeredCollectors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var collector = _step.value;

                    var stash = this._unreportedAccumulations.get(collector);
                    if (stash === undefined) {
                        stash = [];
                        this._unreportedAccumulations.set(collector, stash);
                    }
                    stash.push(currentAccumulation);
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
        }
    }, {
        key: '_getMergedUnreportedAccumulations',
        value: function _getMergedUnreportedAccumulations(collector) {
            var result = new _HashMap.AttributeHashMap();
            var unreportedList = this._unreportedAccumulations.get(collector);
            this._unreportedAccumulations.set(collector, []);
            if (unreportedList === undefined) {
                return result;
            }
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = unreportedList[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var it = _step2.value;

                    result = TemporalMetricProcessor.merge(result, it, this._aggregator);
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

            return result;
        }
    }], [{
        key: 'merge',
        value: function merge(last, current, aggregator) {
            var result = last;
            var iterator = current.entries();
            var next = iterator.next();
            while (next.done !== true) {
                var _next$value = _slicedToArray(next.value, 3),
                    key = _next$value[0],
                    record = _next$value[1],
                    hash = _next$value[2];

                if (last.has(key, hash)) {
                    var lastAccumulation = last.get(key, hash);
                    // last.has() returned true, lastAccumulation is present.
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    var accumulation = aggregator.merge(lastAccumulation, record);
                    result.set(key, accumulation, hash);
                } else {
                    result.set(key, record, hash);
                }
                next = iterator.next();
            }
            return result;
        }
        /**
         * Calibrate the reported metric streams' startTime to lastCollectionTime. Leaves
         * the new stream to be the initial observation time unchanged.
         */

    }, {
        key: 'calibrateStartTime',
        value: function calibrateStartTime(last, current, lastCollectionTime) {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = last.keys()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var _ref = _step3.value;

                    var _ref2 = _slicedToArray(_ref, 2);

                    var key = _ref2[0];
                    var hash = _ref2[1];

                    var currentAccumulation = current.get(key, hash);
                    currentAccumulation === null || currentAccumulation === void 0 ? void 0 : currentAccumulation.setStartTime(lastCollectionTime);
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            return current;
        }
    }]);

    return TemporalMetricProcessor;
}();
// TypeScript complains about converting 3 elements tuple to AccumulationRecord<T>.


function AttributesMapToAccumulationRecords(map) {
    return Array.from(map.entries());
}
//# sourceMappingURL=TemporalMetricProcessor.js.map