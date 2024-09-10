"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DefaultAggregation = exports.ExponentialHistogramAggregation = exports.ExplicitBucketHistogramAggregation = exports.HistogramAggregation = exports.LastValueAggregation = exports.SumAggregation = exports.DropAggregation = exports.Aggregation = undefined;

var _api = require("@opentelemetry/api");

var api = _interopRequireWildcard(_api);

var _aggregator = require("../aggregator");

var _InstrumentDescriptor = require("../InstrumentDescriptor");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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
var __extends = undefined && undefined.__extends || function () {
    var _extendStatics = function extendStatics(d, b) {
        _extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) {
                if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
            }
        };
        return _extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        _extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();

/**
 * Configures how measurements are combined into metrics for views.
 *
 * Aggregation provides a set of built-in aggregations via static methods.
 */
var Aggregation = /** @class */function () {
    function Aggregation() {}
    Aggregation.Drop = function () {
        return DROP_AGGREGATION;
    };
    Aggregation.Sum = function () {
        return SUM_AGGREGATION;
    };
    Aggregation.LastValue = function () {
        return LAST_VALUE_AGGREGATION;
    };
    Aggregation.Histogram = function () {
        return HISTOGRAM_AGGREGATION;
    };
    Aggregation.ExponentialHistogram = function () {
        return EXPONENTIAL_HISTOGRAM_AGGREGATION;
    };
    Aggregation.Default = function () {
        return DEFAULT_AGGREGATION;
    };
    return Aggregation;
}();
exports.Aggregation = Aggregation;
/**
 * The default drop aggregation.
 */

var DropAggregation = /** @class */function (_super) {
    __extends(DropAggregation, _super);
    function DropAggregation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DropAggregation.prototype.createAggregator = function (_instrument) {
        return DropAggregation.DEFAULT_INSTANCE;
    };
    DropAggregation.DEFAULT_INSTANCE = new _aggregator.DropAggregator();
    return DropAggregation;
}(Aggregation);
exports.DropAggregation = DropAggregation;
/**
 * The default sum aggregation.
 */

var SumAggregation = /** @class */function (_super) {
    __extends(SumAggregation, _super);
    function SumAggregation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SumAggregation.prototype.createAggregator = function (instrument) {
        switch (instrument.type) {
            case _InstrumentDescriptor.InstrumentType.COUNTER:
            case _InstrumentDescriptor.InstrumentType.OBSERVABLE_COUNTER:
            case _InstrumentDescriptor.InstrumentType.HISTOGRAM:
                {
                    return SumAggregation.MONOTONIC_INSTANCE;
                }
            default:
                {
                    return SumAggregation.NON_MONOTONIC_INSTANCE;
                }
        }
    };
    SumAggregation.MONOTONIC_INSTANCE = new _aggregator.SumAggregator(true);
    SumAggregation.NON_MONOTONIC_INSTANCE = new _aggregator.SumAggregator(false);
    return SumAggregation;
}(Aggregation);
exports.SumAggregation = SumAggregation;
/**
 * The default last value aggregation.
 */

var LastValueAggregation = /** @class */function (_super) {
    __extends(LastValueAggregation, _super);
    function LastValueAggregation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LastValueAggregation.prototype.createAggregator = function (_instrument) {
        return LastValueAggregation.DEFAULT_INSTANCE;
    };
    LastValueAggregation.DEFAULT_INSTANCE = new _aggregator.LastValueAggregator();
    return LastValueAggregation;
}(Aggregation);
exports.LastValueAggregation = LastValueAggregation;
/**
 * The default histogram aggregation.
 */

var HistogramAggregation = /** @class */function (_super) {
    __extends(HistogramAggregation, _super);
    function HistogramAggregation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HistogramAggregation.prototype.createAggregator = function (_instrument) {
        return HistogramAggregation.DEFAULT_INSTANCE;
    };
    HistogramAggregation.DEFAULT_INSTANCE = new _aggregator.HistogramAggregator([0, 5, 10, 25, 50, 75, 100, 250, 500, 750, 1000, 2500, 5000, 7500, 10000], true);
    return HistogramAggregation;
}(Aggregation);
exports.HistogramAggregation = HistogramAggregation;
/**
 * The explicit bucket histogram aggregation.
 */

var ExplicitBucketHistogramAggregation = /** @class */function (_super) {
    __extends(ExplicitBucketHistogramAggregation, _super);
    /**
     * @param boundaries the bucket boundaries of the histogram aggregation
     * @param _recordMinMax If set to true, min and max will be recorded. Otherwise, min and max will not be recorded.
     */
    function ExplicitBucketHistogramAggregation(boundaries, _recordMinMax) {
        if (_recordMinMax === void 0) {
            _recordMinMax = true;
        }
        var _this = _super.call(this) || this;
        _this._recordMinMax = _recordMinMax;
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
        _this._boundaries = boundaries.slice(minusInfinityIndex + 1, infinityIndex);
        return _this;
    }
    ExplicitBucketHistogramAggregation.prototype.createAggregator = function (_instrument) {
        return new _aggregator.HistogramAggregator(this._boundaries, this._recordMinMax);
    };
    return ExplicitBucketHistogramAggregation;
}(Aggregation);
exports.ExplicitBucketHistogramAggregation = ExplicitBucketHistogramAggregation;

var ExponentialHistogramAggregation = /** @class */function (_super) {
    __extends(ExponentialHistogramAggregation, _super);
    function ExponentialHistogramAggregation(_maxSize, _recordMinMax) {
        if (_maxSize === void 0) {
            _maxSize = 160;
        }
        if (_recordMinMax === void 0) {
            _recordMinMax = true;
        }
        var _this = _super.call(this) || this;
        _this._maxSize = _maxSize;
        _this._recordMinMax = _recordMinMax;
        return _this;
    }
    ExponentialHistogramAggregation.prototype.createAggregator = function (_instrument) {
        return new _aggregator.ExponentialHistogramAggregator(this._maxSize, this._recordMinMax);
    };
    return ExponentialHistogramAggregation;
}(Aggregation);
exports.ExponentialHistogramAggregation = ExponentialHistogramAggregation;
/**
 * The default aggregation.
 */

var DefaultAggregation = /** @class */function (_super) {
    __extends(DefaultAggregation, _super);
    function DefaultAggregation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DefaultAggregation.prototype._resolve = function (instrument) {
        // cast to unknown to disable complaints on the (unreachable) fallback.
        switch (instrument.type) {
            case _InstrumentDescriptor.InstrumentType.COUNTER:
            case _InstrumentDescriptor.InstrumentType.UP_DOWN_COUNTER:
            case _InstrumentDescriptor.InstrumentType.OBSERVABLE_COUNTER:
            case _InstrumentDescriptor.InstrumentType.OBSERVABLE_UP_DOWN_COUNTER:
                {
                    return SUM_AGGREGATION;
                }
            case _InstrumentDescriptor.InstrumentType.GAUGE:
            case _InstrumentDescriptor.InstrumentType.OBSERVABLE_GAUGE:
                {
                    return LAST_VALUE_AGGREGATION;
                }
            case _InstrumentDescriptor.InstrumentType.HISTOGRAM:
                {
                    if (instrument.advice.explicitBucketBoundaries) {
                        return new ExplicitBucketHistogramAggregation(instrument.advice.explicitBucketBoundaries);
                    }
                    return HISTOGRAM_AGGREGATION;
                }
        }
        api.diag.warn("Unable to recognize instrument type: " + instrument.type);
        return DROP_AGGREGATION;
    };
    DefaultAggregation.prototype.createAggregator = function (instrument) {
        return this._resolve(instrument).createAggregator(instrument);
    };
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