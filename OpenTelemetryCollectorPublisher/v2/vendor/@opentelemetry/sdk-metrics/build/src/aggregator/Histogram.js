"use strict";
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

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
exports.HistogramAggregator = exports.HistogramAccumulation = void 0;
var types_1 = require("./types");
var MetricData_1 = require("../export/MetricData");
var InstrumentDescriptor_1 = require("../InstrumentDescriptor");
var utils_1 = require("../utils");
function createNewEmptyCheckpoint(boundaries) {
    var counts = boundaries.map(function () {
        return 0;
    });
    counts.push(0);
    return {
        buckets: {
            boundaries: boundaries,
            counts: counts
        },
        sum: 0,
        count: 0,
        hasMinMax: false,
        min: Infinity,
        max: -Infinity
    };
}

var HistogramAccumulation = function () {
    function HistogramAccumulation(startTime, _boundaries) {
        var _recordMinMax = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

        var _current = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : createNewEmptyCheckpoint(_boundaries);

        _classCallCheck(this, HistogramAccumulation);

        this.startTime = startTime;
        this._boundaries = _boundaries;
        this._recordMinMax = _recordMinMax;
        this._current = _current;
    }

    _createClass(HistogramAccumulation, [{
        key: "record",
        value: function record(value) {
            // NaN does not fall into any bucket, is not zero and should not be counted,
            // NaN is never greater than max nor less than min, therefore return as there's nothing for us to do.
            if (Number.isNaN(value)) {
                return;
            }
            this._current.count += 1;
            this._current.sum += value;
            if (this._recordMinMax) {
                this._current.min = Math.min(value, this._current.min);
                this._current.max = Math.max(value, this._current.max);
                this._current.hasMinMax = true;
            }
            var idx = (0, utils_1.binarySearchLB)(this._boundaries, value);
            this._current.buckets.counts[idx + 1] += 1;
        }
    }, {
        key: "setStartTime",
        value: function setStartTime(startTime) {
            this.startTime = startTime;
        }
    }, {
        key: "toPointValue",
        value: function toPointValue() {
            return this._current;
        }
    }]);

    return HistogramAccumulation;
}();

exports.HistogramAccumulation = HistogramAccumulation;
/**
 * Basic aggregator which observes events and counts them in pre-defined buckets
 * and provides the total sum and count of all observations.
 */

var HistogramAggregator = function () {
    /**
     * @param _boundaries sorted upper bounds of recorded values.
     * @param _recordMinMax If set to true, min and max will be recorded. Otherwise, min and max will not be recorded.
     */
    function HistogramAggregator(_boundaries, _recordMinMax) {
        _classCallCheck(this, HistogramAggregator);

        this._boundaries = _boundaries;
        this._recordMinMax = _recordMinMax;
        this.kind = types_1.AggregatorKind.HISTOGRAM;
    }

    _createClass(HistogramAggregator, [{
        key: "createAccumulation",
        value: function createAccumulation(startTime) {
            return new HistogramAccumulation(startTime, this._boundaries, this._recordMinMax);
        }
        /**
         * Return the result of the merge of two histogram accumulations. As long as one Aggregator
         * instance produces all Accumulations with constant boundaries we don't need to worry about
         * merging accumulations with different boundaries.
         */

    }, {
        key: "merge",
        value: function merge(previous, delta) {
            var previousValue = previous.toPointValue();
            var deltaValue = delta.toPointValue();
            var previousCounts = previousValue.buckets.counts;
            var deltaCounts = deltaValue.buckets.counts;
            var mergedCounts = new Array(previousCounts.length);
            for (var idx = 0; idx < previousCounts.length; idx++) {
                mergedCounts[idx] = previousCounts[idx] + deltaCounts[idx];
            }
            var min = Infinity;
            var max = -Infinity;
            if (this._recordMinMax) {
                if (previousValue.hasMinMax && deltaValue.hasMinMax) {
                    min = Math.min(previousValue.min, deltaValue.min);
                    max = Math.max(previousValue.max, deltaValue.max);
                } else if (previousValue.hasMinMax) {
                    min = previousValue.min;
                    max = previousValue.max;
                } else if (deltaValue.hasMinMax) {
                    min = deltaValue.min;
                    max = deltaValue.max;
                }
            }
            return new HistogramAccumulation(previous.startTime, previousValue.buckets.boundaries, this._recordMinMax, {
                buckets: {
                    boundaries: previousValue.buckets.boundaries,
                    counts: mergedCounts
                },
                count: previousValue.count + deltaValue.count,
                sum: previousValue.sum + deltaValue.sum,
                hasMinMax: this._recordMinMax && (previousValue.hasMinMax || deltaValue.hasMinMax),
                min: min,
                max: max
            });
        }
        /**
         * Returns a new DELTA aggregation by comparing two cumulative measurements.
         */

    }, {
        key: "diff",
        value: function diff(previous, current) {
            var previousValue = previous.toPointValue();
            var currentValue = current.toPointValue();
            var previousCounts = previousValue.buckets.counts;
            var currentCounts = currentValue.buckets.counts;
            var diffedCounts = new Array(previousCounts.length);
            for (var idx = 0; idx < previousCounts.length; idx++) {
                diffedCounts[idx] = currentCounts[idx] - previousCounts[idx];
            }
            return new HistogramAccumulation(current.startTime, previousValue.buckets.boundaries, this._recordMinMax, {
                buckets: {
                    boundaries: previousValue.buckets.boundaries,
                    counts: diffedCounts
                },
                count: currentValue.count - previousValue.count,
                sum: currentValue.sum - previousValue.sum,
                hasMinMax: false,
                min: Infinity,
                max: -Infinity
            });
        }
    }, {
        key: "toMetricData",
        value: function toMetricData(descriptor, aggregationTemporality, accumulationByAttributes, endTime) {
            return {
                descriptor: descriptor,
                aggregationTemporality: aggregationTemporality,
                dataPointType: MetricData_1.DataPointType.HISTOGRAM,
                dataPoints: accumulationByAttributes.map(function (_ref) {
                    var _ref2 = _slicedToArray(_ref, 2),
                        attributes = _ref2[0],
                        accumulation = _ref2[1];

                    var pointValue = accumulation.toPointValue();
                    // determine if instrument allows negative values.
                    var allowsNegativeValues = descriptor.type === InstrumentDescriptor_1.InstrumentType.GAUGE || descriptor.type === InstrumentDescriptor_1.InstrumentType.UP_DOWN_COUNTER || descriptor.type === InstrumentDescriptor_1.InstrumentType.OBSERVABLE_GAUGE || descriptor.type === InstrumentDescriptor_1.InstrumentType.OBSERVABLE_UP_DOWN_COUNTER;
                    return {
                        attributes: attributes,
                        startTime: accumulation.startTime,
                        endTime: endTime,
                        value: {
                            min: pointValue.hasMinMax ? pointValue.min : undefined,
                            max: pointValue.hasMinMax ? pointValue.max : undefined,
                            sum: !allowsNegativeValues ? pointValue.sum : undefined,
                            buckets: pointValue.buckets,
                            count: pointValue.count
                        }
                    };
                })
            };
        }
    }]);

    return HistogramAggregator;
}();

exports.HistogramAggregator = HistogramAggregator;
//# sourceMappingURL=Histogram.js.map