'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ObservableUpDownCounterInstrument = exports.ObservableGaugeInstrument = exports.ObservableCounterInstrument = exports.ObservableInstrument = exports.HistogramInstrument = exports.GaugeInstrument = exports.CounterInstrument = exports.UpDownCounterInstrument = exports.SyncInstrument = undefined;

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


exports.isObservableInstrument = isObservableInstrument;

var _api = require('@opentelemetry/api');

var _core = require('@opentelemetry/core');

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SyncInstrument = exports.SyncInstrument = function () {
    function SyncInstrument(_writableMetricStorage, _descriptor) {
        _classCallCheck(this, SyncInstrument);

        this._writableMetricStorage = _writableMetricStorage;
        this._descriptor = _descriptor;
    }

    _createClass(SyncInstrument, [{
        key: '_record',
        value: function _record(value) {
            var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _api.context.active();

            if (typeof value !== 'number') {
                _api.diag.warn('non-number value provided to metric ' + this._descriptor.name + ': ' + value);
                return;
            }
            if (this._descriptor.valueType === _api.ValueType.INT && !Number.isInteger(value)) {
                _api.diag.warn('INT value type cannot accept a floating-point value for ' + this._descriptor.name + ', ignoring the fractional digits.');
                value = Math.trunc(value);
                // ignore non-finite values.
                if (!Number.isInteger(value)) {
                    return;
                }
            }
            this._writableMetricStorage.record(value, attributes, context, (0, _core.millisToHrTime)(Date.now()));
        }
    }]);

    return SyncInstrument;
}();
/**
 * The class implements {@link UpDownCounter} interface.
 */


var UpDownCounterInstrument = exports.UpDownCounterInstrument = function (_SyncInstrument) {
    _inherits(UpDownCounterInstrument, _SyncInstrument);

    function UpDownCounterInstrument() {
        _classCallCheck(this, UpDownCounterInstrument);

        return _possibleConstructorReturn(this, (UpDownCounterInstrument.__proto__ || Object.getPrototypeOf(UpDownCounterInstrument)).apply(this, arguments));
    }

    _createClass(UpDownCounterInstrument, [{
        key: 'add',

        /**
         * Increment value of counter by the input. Inputs may be negative.
         */
        value: function add(value, attributes, ctx) {
            this._record(value, attributes, ctx);
        }
    }]);

    return UpDownCounterInstrument;
}(SyncInstrument);
/**
 * The class implements {@link Counter} interface.
 */


var CounterInstrument = exports.CounterInstrument = function (_SyncInstrument2) {
    _inherits(CounterInstrument, _SyncInstrument2);

    function CounterInstrument() {
        _classCallCheck(this, CounterInstrument);

        return _possibleConstructorReturn(this, (CounterInstrument.__proto__ || Object.getPrototypeOf(CounterInstrument)).apply(this, arguments));
    }

    _createClass(CounterInstrument, [{
        key: 'add',

        /**
         * Increment value of counter by the input. Inputs may not be negative.
         */
        value: function add(value, attributes, ctx) {
            if (value < 0) {
                _api.diag.warn('negative value provided to counter ' + this._descriptor.name + ': ' + value);
                return;
            }
            this._record(value, attributes, ctx);
        }
    }]);

    return CounterInstrument;
}(SyncInstrument);
/**
 * The class implements {@link Gauge} interface.
 */


var GaugeInstrument = exports.GaugeInstrument = function (_SyncInstrument3) {
    _inherits(GaugeInstrument, _SyncInstrument3);

    function GaugeInstrument() {
        _classCallCheck(this, GaugeInstrument);

        return _possibleConstructorReturn(this, (GaugeInstrument.__proto__ || Object.getPrototypeOf(GaugeInstrument)).apply(this, arguments));
    }

    _createClass(GaugeInstrument, [{
        key: 'record',

        /**
         * Records a measurement.
         */
        value: function record(value, attributes, ctx) {
            this._record(value, attributes, ctx);
        }
    }]);

    return GaugeInstrument;
}(SyncInstrument);
/**
 * The class implements {@link Histogram} interface.
 */


var HistogramInstrument = exports.HistogramInstrument = function (_SyncInstrument4) {
    _inherits(HistogramInstrument, _SyncInstrument4);

    function HistogramInstrument() {
        _classCallCheck(this, HistogramInstrument);

        return _possibleConstructorReturn(this, (HistogramInstrument.__proto__ || Object.getPrototypeOf(HistogramInstrument)).apply(this, arguments));
    }

    _createClass(HistogramInstrument, [{
        key: 'record',

        /**
         * Records a measurement. Value of the measurement must not be negative.
         */
        value: function record(value, attributes, ctx) {
            if (value < 0) {
                _api.diag.warn('negative value provided to histogram ' + this._descriptor.name + ': ' + value);
                return;
            }
            this._record(value, attributes, ctx);
        }
    }]);

    return HistogramInstrument;
}(SyncInstrument);

var ObservableInstrument = exports.ObservableInstrument = function () {
    function ObservableInstrument(descriptor, metricStorages, _observableRegistry) {
        _classCallCheck(this, ObservableInstrument);

        this._observableRegistry = _observableRegistry;
        this._descriptor = descriptor;
        this._metricStorages = metricStorages;
    }
    /**
     * @see {Observable.addCallback}
     */


    _createClass(ObservableInstrument, [{
        key: 'addCallback',
        value: function addCallback(callback) {
            this._observableRegistry.addCallback(callback, this);
        }
        /**
         * @see {Observable.removeCallback}
         */

    }, {
        key: 'removeCallback',
        value: function removeCallback(callback) {
            this._observableRegistry.removeCallback(callback, this);
        }
    }]);

    return ObservableInstrument;
}();

var ObservableCounterInstrument = exports.ObservableCounterInstrument = function (_ObservableInstrument) {
    _inherits(ObservableCounterInstrument, _ObservableInstrument);

    function ObservableCounterInstrument() {
        _classCallCheck(this, ObservableCounterInstrument);

        return _possibleConstructorReturn(this, (ObservableCounterInstrument.__proto__ || Object.getPrototypeOf(ObservableCounterInstrument)).apply(this, arguments));
    }

    return ObservableCounterInstrument;
}(ObservableInstrument);

var ObservableGaugeInstrument = exports.ObservableGaugeInstrument = function (_ObservableInstrument2) {
    _inherits(ObservableGaugeInstrument, _ObservableInstrument2);

    function ObservableGaugeInstrument() {
        _classCallCheck(this, ObservableGaugeInstrument);

        return _possibleConstructorReturn(this, (ObservableGaugeInstrument.__proto__ || Object.getPrototypeOf(ObservableGaugeInstrument)).apply(this, arguments));
    }

    return ObservableGaugeInstrument;
}(ObservableInstrument);

var ObservableUpDownCounterInstrument = exports.ObservableUpDownCounterInstrument = function (_ObservableInstrument3) {
    _inherits(ObservableUpDownCounterInstrument, _ObservableInstrument3);

    function ObservableUpDownCounterInstrument() {
        _classCallCheck(this, ObservableUpDownCounterInstrument);

        return _possibleConstructorReturn(this, (ObservableUpDownCounterInstrument.__proto__ || Object.getPrototypeOf(ObservableUpDownCounterInstrument)).apply(this, arguments));
    }

    return ObservableUpDownCounterInstrument;
}(ObservableInstrument);

function isObservableInstrument(it) {
    return it instanceof ObservableInstrument;
}
//# sourceMappingURL=Instruments.js.map