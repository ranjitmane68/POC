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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultAggregation = exports.ExponentialHistogramAggregation = exports.ExplicitBucketHistogramAggregation = exports.HistogramAggregation = exports.LastValueAggregation = exports.SumAggregation = exports.DropAggregation = exports.Aggregation = void 0;
var api = require("@opentelemetry/api");
var aggregator_1 = require("../aggregator");
var InstrumentDescriptor_1 = require("../InstrumentDescriptor");
/**
 * Configures how measurements are combined into metrics for views.
 *
 * Aggregation provides a set of built-in aggregations via static methods.
 */

var Aggregation = function () {
    function Aggregation() {
        _classCallCheck(this, Aggregation);
    }

    _createClass(Aggregation, null, [{
        key: "Drop",
        value: function Drop() {
            return DROP_AGGREGATION;
        }
    }, {
        key: "Sum",
        value: function Sum() {
            return SUM_AGGREGATION;
        }
    }, {
        key: "LastValue",
        value: function LastValue() {
            return LAST_VALUE_AGGREGATION;
        }
    }, {
        key: "Histogram",
        value: function Histogram() {
            return HISTOGRAM_AGGREGATION;
        }
    }, {
        key: "ExponentialHistogram",
        value: function ExponentialHistogram() {
            return EXPONENTIAL_HISTOGRAM_AGGREGATION;
        }
    }, {
        key: "Default",
        value: function Default() {
            return DEFAULT_AGGREGATION;
        }
    }]);

    return Aggregation;
}();

exports.Aggregation = Aggregation;
/**
 * The default drop aggregation.
 */

var DropAggregation = function (_Aggregation) {
    _inherits(DropAggregation, _Aggregation);

    function DropAggregation() {
        _classCallCheck(this, DropAggregation);

        return _possibleConstructorReturn(this, (DropAggregation.__proto__ || Object.getPrototypeOf(DropAggregation)).apply(this, arguments));
    }

    _createClass(DropAggregation, [{
        key: "createAggregator",
        value: function createAggregator(_instrument) {
            return DropAggregation.DEFAULT_INSTANCE;
        }
    }]);

    return DropAggregation;
}(Aggregation);

exports.DropAggregation = DropAggregation;
DropAggregation.DEFAULT_INSTANCE = new aggregator_1.DropAggregator();
/**
 * The default sum aggregation.
 */

var SumAggregation = function (_Aggregation2) {
    _inherits(SumAggregation, _Aggregation2);

    function SumAggregation() {
        _classCallCheck(this, SumAggregation);

        return _possibleConstructorReturn(this, (SumAggregation.__proto__ || Object.getPrototypeOf(SumAggregation)).apply(this, arguments));
    }

    _createClass(SumAggregation, [{
        key: "createAggregator",
        value: function createAggregator(instrument) {
            switch (instrument.type) {
                case InstrumentDescriptor_1.InstrumentType.COUNTER:
                case InstrumentDescriptor_1.InstrumentType.OBSERVABLE_COUNTER:
                case InstrumentDescriptor_1.InstrumentType.HISTOGRAM:
                    {
                        return SumAggregation.MONOTONIC_INSTANCE;
                    }
                default:
                    {
                        return SumAggregation.NON_MONOTONIC_INSTANCE;
                    }
            }
        }
    }]);

    return SumAggregation;
}(Aggregation);

exports.SumAggregation = SumAggregation;
SumAggregation.MONOTONIC_INSTANCE = new aggregator_1.SumAggregator(true);
SumAggregation.NON_MONOTONIC_INSTANCE = new aggregator_1.SumAggregator(false);
/**
 * The default last value aggregation.
 */

var LastValueAggregation = function (_Aggregation3) {
    _inherits(LastValueAggregation, _Aggregation3);

    function LastValueAggregation() {
        _classCallCheck(this, LastValueAggregation);

        return _possibleConstructorReturn(this, (LastValueAggregation.__proto__ || Object.getPrototypeOf(LastValueAggregation)).apply(this, arguments));
    }

    _createClass(LastValueAggregation, [{
        key: "createAggregator",
        value: function createAggregator(_instrument) {
            return LastValueAggregation.DEFAULT_INSTANCE;
        }
    }]);

    return LastValueAggregation;
}(Aggregation);

exports.LastValueAggregation = LastValueAggregation;
LastValueAggregation.DEFAULT_INSTANCE = new aggregator_1.LastValueAggregator();
/**
 * The default histogram aggregation.
 */

var HistogramAggregation = function (_Aggregation4) {
    _inherits(HistogramAggregation, _Aggregation4);

    function HistogramAggregation() {
        _classCallCheck(this, HistogramAggregation);

        return _possibleConstructorReturn(this, (HistogramAggregation.__proto__ || Object.getPrototypeOf(HistogramAggregation)).apply(this, arguments));
    }

    _createClass(HistogramAggregation, [{
        key: "createAggregator",
        value: function createAggregator(_instrument) {
            return HistogramAggregation.DEFAULT_INSTANCE;
        }
    }]);

    return HistogramAggregation;
}(Aggregation);

exports.HistogramAggregation = HistogramAggregation;
HistogramAggregation.DEFAULT_INSTANCE = new aggregator_1.HistogramAggregator([0, 5, 10, 25, 50, 75, 100, 250, 500, 750, 1000, 2500, 5000, 7500, 10000], true);
/**
 * The explicit bucket histogram aggregation.
 */

var ExplicitBucketHistogramAggregation = function (_Aggregation5) {
    _inherits(ExplicitBucketHistogramAggregation, _Aggregation5);

    /**
     * @param boundaries the bucket boundaries of the histogram aggregation
     * @param _recordMinMax If set to true, min and max will be recorded. Otherwise, min and max will not be recorded.
     */
    function ExplicitBucketHistogramAggregation(boundaries) {
        var _recordMinMax = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        _classCallCheck(this, ExplicitBucketHistogramAggregation);

        var _this5 = _possibleConstructorReturn(this, (ExplicitBucketHistogramAggregation.__proto__ || Object.getPrototypeOf(ExplicitBucketHistogramAggregation)).call(this));

        _this5._recordMinMax = _recordMinMax;
        if (boundaries == null) {
            throw new Error('ExplicitBucketHistogramAggregation should be created with explicit boundaries, if a single bucket histogram is required, please pass an empty array');
        }
        // Copy the boundaries array for modification.
        boundaries = boundaries.concat();
        // We need to an ordered set to be able to correctly compute count for each
        // boundary since we'll iterate on each in order.
        boundaries = boundaries.sort(function (a, b) {
            return a - b;
        });
        // Remove all Infinity from the boundaries.
        var minusInfinityIndex = boundaries.lastIndexOf(-Infinity);
        var infinityIndex = boundaries.indexOf(Infinity);
        if (infinityIndex === -1) {
            infinityIndex = undefined;
        }
        _this5._boundaries = boundaries.slice(minusInfinityIndex + 1, infinityIndex);
        return _this5;
    }

    _createClass(ExplicitBucketHistogramAggregation, [{
        key: "createAggregator",
        value: function createAggregator(_instrument) {
            return new aggregator_1.HistogramAggregator(this._boundaries, this._recordMinMax);
        }
    }]);

    return ExplicitBucketHistogramAggregation;
}(Aggregation);

exports.ExplicitBucketHistogramAggregation = ExplicitBucketHistogramAggregation;

var ExponentialHistogramAggregation = function (_Aggregation6) {
    _inherits(ExponentialHistogramAggregation, _Aggregation6);

    function ExponentialHistogramAggregation() {
        var _maxSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 160;

        var _recordMinMax = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        _classCallCheck(this, ExponentialHistogramAggregation);

        var _this6 = _possibleConstructorReturn(this, (ExponentialHistogramAggregation.__proto__ || Object.getPrototypeOf(ExponentialHistogramAggregation)).call(this));

        _this6._maxSize = _maxSize;
        _this6._recordMinMax = _recordMinMax;
        return _this6;
    }

    _createClass(ExponentialHistogramAggregation, [{
        key: "createAggregator",
        value: function createAggregator(_instrument) {
            return new aggregator_1.ExponentialHistogramAggregator(this._maxSize, this._recordMinMax);
        }
    }]);

    return ExponentialHistogramAggregation;
}(Aggregation);

exports.ExponentialHistogramAggregation = ExponentialHistogramAggregation;
/**
 * The default aggregation.
 */

var DefaultAggregation = function (_Aggregation7) {
    _inherits(DefaultAggregation, _Aggregation7);

    function DefaultAggregation() {
        _classCallCheck(this, DefaultAggregation);

        return _possibleConstructorReturn(this, (DefaultAggregation.__proto__ || Object.getPrototypeOf(DefaultAggregation)).apply(this, arguments));
    }

    _createClass(DefaultAggregation, [{
        key: "_resolve",
        value: function _resolve(instrument) {
            // cast to unknown to disable complaints on the (unreachable) fallback.
            switch (instrument.type) {
                case InstrumentDescriptor_1.InstrumentType.COUNTER:
                case InstrumentDescriptor_1.InstrumentType.UP_DOWN_COUNTER:
                case InstrumentDescriptor_1.InstrumentType.OBSERVABLE_COUNTER:
                case InstrumentDescriptor_1.InstrumentType.OBSERVABLE_UP_DOWN_COUNTER:
                    {
                        return SUM_AGGREGATION;
                    }
                case InstrumentDescriptor_1.InstrumentType.GAUGE:
                case InstrumentDescriptor_1.InstrumentType.OBSERVABLE_GAUGE:
                    {
                        return LAST_VALUE_AGGREGATION;
                    }
                case InstrumentDescriptor_1.InstrumentType.HISTOGRAM:
                    {
                        if (instrument.advice.explicitBucketBoundaries) {
                            return new ExplicitBucketHistogramAggregation(instrument.advice.explicitBucketBoundaries);
                        }
                        return HISTOGRAM_AGGREGATION;
                    }
            }
            api.diag.warn("Unable to recognize instrument type: " + instrument.type);
            return DROP_AGGREGATION;
        }
    }, {
        key: "createAggregator",
        value: function createAggregator(instrument) {
            return this._resolve(instrument).createAggregator(instrument);
        }
    }]);

    return DefaultAggregation;
}(Aggregation);

exports.DefaultAggregation = DefaultAggregation;
var DROP_AGGREGATION = new DropAggregation();
var SUM_AGGREGATION = new SumAggregation();
var LAST_VALUE_AGGREGATION = new LastValueAggregation();
var HISTOGRAM_AGGREGATION = new HistogramAggregation();
var EXPONENTIAL_HISTOGRAM_AGGREGATION = new ExponentialHistogramAggregation();
var DEFAULT_AGGREGATION = new DefaultAggregation();
//# sourceMappingURL=Aggregation.js.map