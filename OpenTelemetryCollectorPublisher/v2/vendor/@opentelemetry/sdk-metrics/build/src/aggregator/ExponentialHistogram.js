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
exports.ExponentialHistogramAggregator = exports.ExponentialHistogramAccumulation = void 0;
var types_1 = require("./types");
var MetricData_1 = require("../export/MetricData");
var api_1 = require("@opentelemetry/api");
var InstrumentDescriptor_1 = require("../InstrumentDescriptor");
var Buckets_1 = require("./exponential-histogram/Buckets");
var getMapping_1 = require("./exponential-histogram/mapping/getMapping");
var util_1 = require("./exponential-histogram/util");
// HighLow is a utility class used for computing a common scale for
// two exponential histogram accumulations

var HighLow = function () {
    function HighLow(low, high) {
        _classCallCheck(this, HighLow);

        this.low = low;
        this.high = high;
    }

    _createClass(HighLow, null, [{
        key: "combine",
        value: function combine(h1, h2) {
            return new HighLow(Math.min(h1.low, h2.low), Math.max(h1.high, h2.high));
        }
    }]);

    return HighLow;
}();

var MAX_SCALE = 20;
var DEFAULT_MAX_SIZE = 160;
var MIN_MAX_SIZE = 2;

var ExponentialHistogramAccumulation = function () {
    function ExponentialHistogramAccumulation() {
        var startTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : startTime;

        var _maxSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_MAX_SIZE;

        var _recordMinMax = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

        var _sum = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

        var _count = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

        var _zeroCount = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

        var _min = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : Number.POSITIVE_INFINITY;

        var _max = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : Number.NEGATIVE_INFINITY;

        var _positive = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : new Buckets_1.Buckets();

        var _negative = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : new Buckets_1.Buckets();

        var _mapping = arguments.length > 10 && arguments[10] !== undefined ? arguments[10] : (0, getMapping_1.getMapping)(MAX_SCALE);

        _classCallCheck(this, ExponentialHistogramAccumulation);

        this.startTime = startTime;
        this._maxSize = _maxSize;
        this._recordMinMax = _recordMinMax;
        this._sum = _sum;
        this._count = _count;
        this._zeroCount = _zeroCount;
        this._min = _min;
        this._max = _max;
        this._positive = _positive;
        this._negative = _negative;
        this._mapping = _mapping;
        if (this._maxSize < MIN_MAX_SIZE) {
            api_1.diag.warn("Exponential Histogram Max Size set to " + this._maxSize + ",                 changing to the minimum size of: " + MIN_MAX_SIZE);
            this._maxSize = MIN_MAX_SIZE;
        }
    }
    /**
     * record updates a histogram with a single count
     * @param {Number} value
     */


    _createClass(ExponentialHistogramAccumulation, [{
        key: "record",
        value: function record(value) {
            this.updateByIncrement(value, 1);
        }
        /**
         * Sets the start time for this accumulation
         * @param {HrTime} startTime
         */

    }, {
        key: "setStartTime",
        value: function setStartTime(startTime) {
            this.startTime = startTime;
        }
        /**
         * Returns the datapoint representation of this accumulation
         * @param {HrTime} startTime
         */

    }, {
        key: "toPointValue",
        value: function toPointValue() {
            return {
                hasMinMax: this._recordMinMax,
                min: this.min,
                max: this.max,
                sum: this.sum,
                positive: {
                    offset: this.positive.offset,
                    bucketCounts: this.positive.counts()
                },
                negative: {
                    offset: this.negative.offset,
                    bucketCounts: this.negative.counts()
                },
                count: this.count,
                scale: this.scale,
                zeroCount: this.zeroCount
            };
        }
        /**
         * @returns {Number} The sum of values recorded by this accumulation
         */

    }, {
        key: "updateByIncrement",

        /**
         * updateByIncr supports updating a histogram with a non-negative
         * increment.
         * @param value
         * @param increment
         */
        value: function updateByIncrement(value, increment) {
            // NaN does not fall into any bucket, is not zero and should not be counted,
            // NaN is never greater than max nor less than min, therefore return as there's nothing for us to do.
            if (Number.isNaN(value)) {
                return;
            }
            if (value > this._max) {
                this._max = value;
            }
            if (value < this._min) {
                this._min = value;
            }
            this._count += increment;
            if (value === 0) {
                this._zeroCount += increment;
                return;
            }
            this._sum += value * increment;
            if (value > 0) {
                this._updateBuckets(this._positive, value, increment);
            } else {
                this._updateBuckets(this._negative, -value, increment);
            }
        }
        /**
         * merge combines data from previous value into self
         * @param {ExponentialHistogramAccumulation} previous
         */

    }, {
        key: "merge",
        value: function merge(previous) {
            if (this._count === 0) {
                this._min = previous.min;
                this._max = previous.max;
            } else if (previous.count !== 0) {
                if (previous.min < this.min) {
                    this._min = previous.min;
                }
                if (previous.max > this.max) {
                    this._max = previous.max;
                }
            }
            this.startTime = previous.startTime;
            this._sum += previous.sum;
            this._count += previous.count;
            this._zeroCount += previous.zeroCount;
            var minScale = this._minScale(previous);
            this._downscale(this.scale - minScale);
            this._mergeBuckets(this.positive, previous, previous.positive, minScale);
            this._mergeBuckets(this.negative, previous, previous.negative, minScale);
        }
        /**
         * diff subtracts other from self
         * @param {ExponentialHistogramAccumulation} other
         */

    }, {
        key: "diff",
        value: function diff(other) {
            this._min = Infinity;
            this._max = -Infinity;
            this._sum -= other.sum;
            this._count -= other.count;
            this._zeroCount -= other.zeroCount;
            var minScale = this._minScale(other);
            this._downscale(this.scale - minScale);
            this._diffBuckets(this.positive, other, other.positive, minScale);
            this._diffBuckets(this.negative, other, other.negative, minScale);
        }
        /**
         * clone returns a deep copy of self
         * @returns {ExponentialHistogramAccumulation}
         */

    }, {
        key: "clone",
        value: function clone() {
            return new ExponentialHistogramAccumulation(this.startTime, this._maxSize, this._recordMinMax, this._sum, this._count, this._zeroCount, this._min, this._max, this.positive.clone(), this.negative.clone(), this._mapping);
        }
        /**
         * _updateBuckets maps the incoming value to a bucket index for the current
         * scale. If the bucket index is outside of the range of the backing array,
         * it will rescale the backing array and update the mapping for the new scale.
         */

    }, {
        key: "_updateBuckets",
        value: function _updateBuckets(buckets, value, increment) {
            var index = this._mapping.mapToIndex(value);
            // rescale the mapping if needed
            var rescalingNeeded = false;
            var high = 0;
            var low = 0;
            if (buckets.length === 0) {
                buckets.indexStart = index;
                buckets.indexEnd = buckets.indexStart;
                buckets.indexBase = buckets.indexStart;
            } else if (index < buckets.indexStart && buckets.indexEnd - index >= this._maxSize) {
                rescalingNeeded = true;
                low = index;
                high = buckets.indexEnd;
            } else if (index > buckets.indexEnd && index - buckets.indexStart >= this._maxSize) {
                rescalingNeeded = true;
                low = buckets.indexStart;
                high = index;
            }
            // rescale and compute index at new scale
            if (rescalingNeeded) {
                var change = this._changeScale(high, low);
                this._downscale(change);
                index = this._mapping.mapToIndex(value);
            }
            this._incrementIndexBy(buckets, index, increment);
        }
        /**
         * _incrementIndexBy increments the count of the bucket specified by `index`.
         * If the index is outside of the range [buckets.indexStart, buckets.indexEnd]
         * the boundaries of the backing array will be adjusted and more buckets will
         * be added if needed.
         */

    }, {
        key: "_incrementIndexBy",
        value: function _incrementIndexBy(buckets, index, increment) {
            if (increment === 0) {
                // nothing to do for a zero increment, can happen during a merge operation
                return;
            }
            if (buckets.length === 0) {
                buckets.indexStart = buckets.indexEnd = buckets.indexBase = index;
            }
            if (index < buckets.indexStart) {
                var span = buckets.indexEnd - index;
                if (span >= buckets.backing.length) {
                    this._grow(buckets, span + 1);
                }
                buckets.indexStart = index;
            } else if (index > buckets.indexEnd) {
                var _span = index - buckets.indexStart;
                if (_span >= buckets.backing.length) {
                    this._grow(buckets, _span + 1);
                }
                buckets.indexEnd = index;
            }
            var bucketIndex = index - buckets.indexBase;
            if (bucketIndex < 0) {
                bucketIndex += buckets.backing.length;
            }
            buckets.incrementBucket(bucketIndex, increment);
        }
        /**
         * grow resizes the backing array by doubling in size up to maxSize.
         * This extends the array with a bunch of zeros and copies the
         * existing counts to the same position.
         */

    }, {
        key: "_grow",
        value: function _grow(buckets, needed) {
            var size = buckets.backing.length;
            var bias = buckets.indexBase - buckets.indexStart;
            var oldPositiveLimit = size - bias;
            var newSize = (0, util_1.nextGreaterSquare)(needed);
            if (newSize > this._maxSize) {
                newSize = this._maxSize;
            }
            var newPositiveLimit = newSize - bias;
            buckets.backing.growTo(newSize, oldPositiveLimit, newPositiveLimit);
        }
        /**
         * _changeScale computes how much downscaling is needed by shifting the
         * high and low values until they are separated by no more than size.
         */

    }, {
        key: "_changeScale",
        value: function _changeScale(high, low) {
            var change = 0;
            while (high - low >= this._maxSize) {
                high >>= 1;
                low >>= 1;
                change++;
            }
            return change;
        }
        /**
         * _downscale subtracts `change` from the current mapping scale.
         */

    }, {
        key: "_downscale",
        value: function _downscale(change) {
            if (change === 0) {
                return;
            }
            if (change < 0) {
                // Note: this should be impossible. If we get here it's because
                // there is a bug in the implementation.
                throw new Error("impossible change of scale: " + this.scale);
            }
            var newScale = this._mapping.scale - change;
            this._positive.downscale(change);
            this._negative.downscale(change);
            this._mapping = (0, getMapping_1.getMapping)(newScale);
        }
        /**
         * _minScale is used by diff and merge to compute an ideal combined scale
         */

    }, {
        key: "_minScale",
        value: function _minScale(other) {
            var minScale = Math.min(this.scale, other.scale);
            var highLowPos = HighLow.combine(this._highLowAtScale(this.positive, this.scale, minScale), this._highLowAtScale(other.positive, other.scale, minScale));
            var highLowNeg = HighLow.combine(this._highLowAtScale(this.negative, this.scale, minScale), this._highLowAtScale(other.negative, other.scale, minScale));
            return Math.min(minScale - this._changeScale(highLowPos.high, highLowPos.low), minScale - this._changeScale(highLowNeg.high, highLowNeg.low));
        }
        /**
         * _highLowAtScale is used by diff and merge to compute an ideal combined scale.
         */

    }, {
        key: "_highLowAtScale",
        value: function _highLowAtScale(buckets, currentScale, newScale) {
            if (buckets.length === 0) {
                return new HighLow(0, -1);
            }
            var shift = currentScale - newScale;
            return new HighLow(buckets.indexStart >> shift, buckets.indexEnd >> shift);
        }
        /**
         * _mergeBuckets translates index values from another histogram and
         * adds the values into the corresponding buckets of this histogram.
         */

    }, {
        key: "_mergeBuckets",
        value: function _mergeBuckets(ours, other, theirs, scale) {
            var theirOffset = theirs.offset;
            var theirChange = other.scale - scale;
            for (var i = 0; i < theirs.length; i++) {
                this._incrementIndexBy(ours, theirOffset + i >> theirChange, theirs.at(i));
            }
        }
        /**
         * _diffBuckets translates index values from another histogram and
         * subtracts the values in the corresponding buckets of this histogram.
         */

    }, {
        key: "_diffBuckets",
        value: function _diffBuckets(ours, other, theirs, scale) {
            var theirOffset = theirs.offset;
            var theirChange = other.scale - scale;
            for (var i = 0; i < theirs.length; i++) {
                var ourIndex = theirOffset + i >> theirChange;
                var bucketIndex = ourIndex - ours.indexBase;
                if (bucketIndex < 0) {
                    bucketIndex += ours.backing.length;
                }
                ours.decrementBucket(bucketIndex, theirs.at(i));
            }
            ours.trim();
        }
    }, {
        key: "sum",
        get: function get() {
            return this._sum;
        }
        /**
         * @returns {Number} The minimum value recorded by this accumulation
         */

    }, {
        key: "min",
        get: function get() {
            return this._min;
        }
        /**
         * @returns {Number} The maximum value recorded by this accumulation
         */

    }, {
        key: "max",
        get: function get() {
            return this._max;
        }
        /**
         * @returns {Number} The count of values recorded by this accumulation
         */

    }, {
        key: "count",
        get: function get() {
            return this._count;
        }
        /**
         * @returns {Number} The number of 0 values recorded by this accumulation
         */

    }, {
        key: "zeroCount",
        get: function get() {
            return this._zeroCount;
        }
        /**
         * @returns {Number} The scale used by this accumulation
         */

    }, {
        key: "scale",
        get: function get() {
            if (this._count === this._zeroCount) {
                // all zeros! scale doesn't matter, use zero
                return 0;
            }
            return this._mapping.scale;
        }
        /**
         * positive holds the positive values
         * @returns {Buckets}
         */

    }, {
        key: "positive",
        get: function get() {
            return this._positive;
        }
        /**
         * negative holds the negative values by their absolute value
         * @returns {Buckets}
         */

    }, {
        key: "negative",
        get: function get() {
            return this._negative;
        }
    }]);

    return ExponentialHistogramAccumulation;
}();

exports.ExponentialHistogramAccumulation = ExponentialHistogramAccumulation;
/**
 * Aggregator for ExponentialHistogramAccumulations
 */

var ExponentialHistogramAggregator = function () {
    /**
     * @param _maxSize Maximum number of buckets for each of the positive
     *    and negative ranges, exclusive of the zero-bucket.
     * @param _recordMinMax If set to true, min and max will be recorded.
     *    Otherwise, min and max will not be recorded.
     */
    function ExponentialHistogramAggregator(_maxSize, _recordMinMax) {
        _classCallCheck(this, ExponentialHistogramAggregator);

        this._maxSize = _maxSize;
        this._recordMinMax = _recordMinMax;
        this.kind = types_1.AggregatorKind.EXPONENTIAL_HISTOGRAM;
    }

    _createClass(ExponentialHistogramAggregator, [{
        key: "createAccumulation",
        value: function createAccumulation(startTime) {
            return new ExponentialHistogramAccumulation(startTime, this._maxSize, this._recordMinMax);
        }
        /**
         * Return the result of the merge of two exponential histogram accumulations.
         */

    }, {
        key: "merge",
        value: function merge(previous, delta) {
            var result = delta.clone();
            result.merge(previous);
            return result;
        }
        /**
         * Returns a new DELTA aggregation by comparing two cumulative measurements.
         */

    }, {
        key: "diff",
        value: function diff(previous, current) {
            var result = current.clone();
            result.diff(previous);
            return result;
        }
    }, {
        key: "toMetricData",
        value: function toMetricData(descriptor, aggregationTemporality, accumulationByAttributes, endTime) {
            return {
                descriptor: descriptor,
                aggregationTemporality: aggregationTemporality,
                dataPointType: MetricData_1.DataPointType.EXPONENTIAL_HISTOGRAM,
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
                            positive: {
                                offset: pointValue.positive.offset,
                                bucketCounts: pointValue.positive.bucketCounts
                            },
                            negative: {
                                offset: pointValue.negative.offset,
                                bucketCounts: pointValue.negative.bucketCounts
                            },
                            count: pointValue.count,
                            scale: pointValue.scale,
                            zeroCount: pointValue.zeroCount
                        }
                    };
                })
            };
        }
    }]);

    return ExponentialHistogramAggregator;
}();

exports.ExponentialHistogramAggregator = ExponentialHistogramAggregator;
//# sourceMappingURL=ExponentialHistogram.js.map