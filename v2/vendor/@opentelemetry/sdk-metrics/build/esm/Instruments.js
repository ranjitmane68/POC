"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ObservableUpDownCounterInstrument = exports.ObservableGaugeInstrument = exports.ObservableCounterInstrument = exports.ObservableInstrument = exports.HistogramInstrument = exports.GaugeInstrument = exports.CounterInstrument = exports.UpDownCounterInstrument = exports.SyncInstrument = undefined;
exports.isObservableInstrument = isObservableInstrument;

var _api = require("@opentelemetry/api");

var _core = require("@opentelemetry/core");

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

var SyncInstrument = /** @class */function () {
    function SyncInstrument(_writableMetricStorage, _descriptor) {
        this._writableMetricStorage = _writableMetricStorage;
        this._descriptor = _descriptor;
    }
    SyncInstrument.prototype._record = function (value, attributes, context) {
        if (attributes === void 0) {
            attributes = {};
        }
        if (context === void 0) {
            context = _api.context.active();
        }
        if (typeof value !== 'number') {
            _api.diag.warn("non-number value provided to metric " + this._descriptor.name + ": " + value);
            return;
        }
        if (this._descriptor.valueType === _api.ValueType.INT && !Number.isInteger(value)) {
            _api.diag.warn("INT value type cannot accept a floating-point value for " + this._descriptor.name + ", ignoring the fractional digits.");
            value = Math.trunc(value);
            // ignore non-finite values.
            if (!Number.isInteger(value)) {
                return;
            }
        }
        this._writableMetricStorage.record(value, attributes, context, (0, _core.millisToHrTime)(Date.now()));
    };
    return SyncInstrument;
}();
exports.SyncInstrument = SyncInstrument;
/**
 * The class implements {@link UpDownCounter} interface.
 */

var UpDownCounterInstrument = /** @class */function (_super) {
    __extends(UpDownCounterInstrument, _super);
    function UpDownCounterInstrument() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Increment value of counter by the input. Inputs may be negative.
     */
    UpDownCounterInstrument.prototype.add = function (value, attributes, ctx) {
        this._record(value, attributes, ctx);
    };
    return UpDownCounterInstrument;
}(SyncInstrument);
exports.UpDownCounterInstrument = UpDownCounterInstrument;
/**
 * The class implements {@link Counter} interface.
 */

var CounterInstrument = /** @class */function (_super) {
    __extends(CounterInstrument, _super);
    function CounterInstrument() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Increment value of counter by the input. Inputs may not be negative.
     */
    CounterInstrument.prototype.add = function (value, attributes, ctx) {
        if (value < 0) {
            _api.diag.warn("negative value provided to counter " + this._descriptor.name + ": " + value);
            return;
        }
        this._record(value, attributes, ctx);
    };
    return CounterInstrument;
}(SyncInstrument);
exports.CounterInstrument = CounterInstrument;
/**
 * The class implements {@link Gauge} interface.
 */

var GaugeInstrument = /** @class */function (_super) {
    __extends(GaugeInstrument, _super);
    function GaugeInstrument() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Records a measurement.
     */
    GaugeInstrument.prototype.record = function (value, attributes, ctx) {
        this._record(value, attributes, ctx);
    };
    return GaugeInstrument;
}(SyncInstrument);
exports.GaugeInstrument = GaugeInstrument;
/**
 * The class implements {@link Histogram} interface.
 */

var HistogramInstrument = /** @class */function (_super) {
    __extends(HistogramInstrument, _super);
    function HistogramInstrument() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Records a measurement. Value of the measurement must not be negative.
     */
    HistogramInstrument.prototype.record = function (value, attributes, ctx) {
        if (value < 0) {
            _api.diag.warn("negative value provided to histogram " + this._descriptor.name + ": " + value);
            return;
        }
        this._record(value, attributes, ctx);
    };
    return HistogramInstrument;
}(SyncInstrument);
exports.HistogramInstrument = HistogramInstrument;

var ObservableInstrument = /** @class */function () {
    function ObservableInstrument(descriptor, metricStorages, _observableRegistry) {
        this._observableRegistry = _observableRegistry;
        this._descriptor = descriptor;
        this._metricStorages = metricStorages;
    }
    /**
     * @see {Observable.addCallback}
     */
    ObservableInstrument.prototype.addCallback = function (callback) {
        this._observableRegistry.addCallback(callback, this);
    };
    /**
     * @see {Observable.removeCallback}
     */
    ObservableInstrument.prototype.removeCallback = function (callback) {
        this._observableRegistry.removeCallback(callback, this);
    };
    return ObservableInstrument;
}();
exports.ObservableInstrument = ObservableInstrument;

var ObservableCounterInstrument = /** @class */function (_super) {
    __extends(ObservableCounterInstrument, _super);
    function ObservableCounterInstrument() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ObservableCounterInstrument;
}(ObservableInstrument);
exports.ObservableCounterInstrument = ObservableCounterInstrument;

var ObservableGaugeInstrument = /** @class */function (_super) {
    __extends(ObservableGaugeInstrument, _super);
    function ObservableGaugeInstrument() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ObservableGaugeInstrument;
}(ObservableInstrument);
exports.ObservableGaugeInstrument = ObservableGaugeInstrument;

var ObservableUpDownCounterInstrument = /** @class */function (_super) {
    __extends(ObservableUpDownCounterInstrument, _super);
    function ObservableUpDownCounterInstrument() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ObservableUpDownCounterInstrument;
}(ObservableInstrument);
exports.ObservableUpDownCounterInstrument = ObservableUpDownCounterInstrument;
function isObservableInstrument(it) {
    return it instanceof ObservableInstrument;
}
//# sourceMappingURL=Instruments.js.map