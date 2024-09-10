"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.createNoopMeter = createNoopMeter;

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
/**
 * NoopMeter is a noop implementation of the {@link Meter} interface. It reuses
 * constant NoopMetrics for all of its methods.
 */
var NoopMeter = exports.NoopMeter = function () {
    function NoopMeter() {
        _classCallCheck(this, NoopMeter);
    }
    /**
     * @see {@link Meter.createGauge}
     */


    _createClass(NoopMeter, [{
        key: "createGauge",
        value: function createGauge(_name, _options) {
            return NOOP_GAUGE_METRIC;
        }
        /**
         * @see {@link Meter.createHistogram}
         */

    }, {
        key: "createHistogram",
        value: function createHistogram(_name, _options) {
            return NOOP_HISTOGRAM_METRIC;
        }
        /**
         * @see {@link Meter.createCounter}
         */

    }, {
        key: "createCounter",
        value: function createCounter(_name, _options) {
            return NOOP_COUNTER_METRIC;
        }
        /**
         * @see {@link Meter.createUpDownCounter}
         */

    }, {
        key: "createUpDownCounter",
        value: function createUpDownCounter(_name, _options) {
            return NOOP_UP_DOWN_COUNTER_METRIC;
        }
        /**
         * @see {@link Meter.createObservableGauge}
         */

    }, {
        key: "createObservableGauge",
        value: function createObservableGauge(_name, _options) {
            return NOOP_OBSERVABLE_GAUGE_METRIC;
        }
        /**
         * @see {@link Meter.createObservableCounter}
         */

    }, {
        key: "createObservableCounter",
        value: function createObservableCounter(_name, _options) {
            return NOOP_OBSERVABLE_COUNTER_METRIC;
        }
        /**
         * @see {@link Meter.createObservableUpDownCounter}
         */

    }, {
        key: "createObservableUpDownCounter",
        value: function createObservableUpDownCounter(_name, _options) {
            return NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC;
        }
        /**
         * @see {@link Meter.addBatchObservableCallback}
         */

    }, {
        key: "addBatchObservableCallback",
        value: function addBatchObservableCallback(_callback, _observables) {}
        /**
         * @see {@link Meter.removeBatchObservableCallback}
         */

    }, {
        key: "removeBatchObservableCallback",
        value: function removeBatchObservableCallback(_callback) {}
    }]);

    return NoopMeter;
}();

var NoopMetric = exports.NoopMetric = function NoopMetric() {
    _classCallCheck(this, NoopMetric);
};

var NoopCounterMetric = exports.NoopCounterMetric = function (_NoopMetric) {
    _inherits(NoopCounterMetric, _NoopMetric);

    function NoopCounterMetric() {
        _classCallCheck(this, NoopCounterMetric);

        return _possibleConstructorReturn(this, (NoopCounterMetric.__proto__ || Object.getPrototypeOf(NoopCounterMetric)).apply(this, arguments));
    }

    _createClass(NoopCounterMetric, [{
        key: "add",
        value: function add(_value, _attributes) {}
    }]);

    return NoopCounterMetric;
}(NoopMetric);

var NoopUpDownCounterMetric = exports.NoopUpDownCounterMetric = function (_NoopMetric2) {
    _inherits(NoopUpDownCounterMetric, _NoopMetric2);

    function NoopUpDownCounterMetric() {
        _classCallCheck(this, NoopUpDownCounterMetric);

        return _possibleConstructorReturn(this, (NoopUpDownCounterMetric.__proto__ || Object.getPrototypeOf(NoopUpDownCounterMetric)).apply(this, arguments));
    }

    _createClass(NoopUpDownCounterMetric, [{
        key: "add",
        value: function add(_value, _attributes) {}
    }]);

    return NoopUpDownCounterMetric;
}(NoopMetric);

var NoopGaugeMetric = exports.NoopGaugeMetric = function (_NoopMetric3) {
    _inherits(NoopGaugeMetric, _NoopMetric3);

    function NoopGaugeMetric() {
        _classCallCheck(this, NoopGaugeMetric);

        return _possibleConstructorReturn(this, (NoopGaugeMetric.__proto__ || Object.getPrototypeOf(NoopGaugeMetric)).apply(this, arguments));
    }

    _createClass(NoopGaugeMetric, [{
        key: "record",
        value: function record(_value, _attributes) {}
    }]);

    return NoopGaugeMetric;
}(NoopMetric);

var NoopHistogramMetric = exports.NoopHistogramMetric = function (_NoopMetric4) {
    _inherits(NoopHistogramMetric, _NoopMetric4);

    function NoopHistogramMetric() {
        _classCallCheck(this, NoopHistogramMetric);

        return _possibleConstructorReturn(this, (NoopHistogramMetric.__proto__ || Object.getPrototypeOf(NoopHistogramMetric)).apply(this, arguments));
    }

    _createClass(NoopHistogramMetric, [{
        key: "record",
        value: function record(_value, _attributes) {}
    }]);

    return NoopHistogramMetric;
}(NoopMetric);

var NoopObservableMetric = exports.NoopObservableMetric = function () {
    function NoopObservableMetric() {
        _classCallCheck(this, NoopObservableMetric);
    }

    _createClass(NoopObservableMetric, [{
        key: "addCallback",
        value: function addCallback(_callback) {}
    }, {
        key: "removeCallback",
        value: function removeCallback(_callback) {}
    }]);

    return NoopObservableMetric;
}();

var NoopObservableCounterMetric = exports.NoopObservableCounterMetric = function (_NoopObservableMetric) {
    _inherits(NoopObservableCounterMetric, _NoopObservableMetric);

    function NoopObservableCounterMetric() {
        _classCallCheck(this, NoopObservableCounterMetric);

        return _possibleConstructorReturn(this, (NoopObservableCounterMetric.__proto__ || Object.getPrototypeOf(NoopObservableCounterMetric)).apply(this, arguments));
    }

    return NoopObservableCounterMetric;
}(NoopObservableMetric);

var NoopObservableGaugeMetric = exports.NoopObservableGaugeMetric = function (_NoopObservableMetric2) {
    _inherits(NoopObservableGaugeMetric, _NoopObservableMetric2);

    function NoopObservableGaugeMetric() {
        _classCallCheck(this, NoopObservableGaugeMetric);

        return _possibleConstructorReturn(this, (NoopObservableGaugeMetric.__proto__ || Object.getPrototypeOf(NoopObservableGaugeMetric)).apply(this, arguments));
    }

    return NoopObservableGaugeMetric;
}(NoopObservableMetric);

var NoopObservableUpDownCounterMetric = exports.NoopObservableUpDownCounterMetric = function (_NoopObservableMetric3) {
    _inherits(NoopObservableUpDownCounterMetric, _NoopObservableMetric3);

    function NoopObservableUpDownCounterMetric() {
        _classCallCheck(this, NoopObservableUpDownCounterMetric);

        return _possibleConstructorReturn(this, (NoopObservableUpDownCounterMetric.__proto__ || Object.getPrototypeOf(NoopObservableUpDownCounterMetric)).apply(this, arguments));
    }

    return NoopObservableUpDownCounterMetric;
}(NoopObservableMetric);

var NOOP_METER = exports.NOOP_METER = new NoopMeter();
// Synchronous instruments
var NOOP_COUNTER_METRIC = exports.NOOP_COUNTER_METRIC = new NoopCounterMetric();
var NOOP_GAUGE_METRIC = exports.NOOP_GAUGE_METRIC = new NoopGaugeMetric();
var NOOP_HISTOGRAM_METRIC = exports.NOOP_HISTOGRAM_METRIC = new NoopHistogramMetric();
var NOOP_UP_DOWN_COUNTER_METRIC = exports.NOOP_UP_DOWN_COUNTER_METRIC = new NoopUpDownCounterMetric();
// Asynchronous instruments
var NOOP_OBSERVABLE_COUNTER_METRIC = exports.NOOP_OBSERVABLE_COUNTER_METRIC = new NoopObservableCounterMetric();
var NOOP_OBSERVABLE_GAUGE_METRIC = exports.NOOP_OBSERVABLE_GAUGE_METRIC = new NoopObservableGaugeMetric();
var NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = exports.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = new NoopObservableUpDownCounterMetric();
/**
 * Create a no-op Meter
 */
function createNoopMeter() {
    return NOOP_METER;
}
//# sourceMappingURL=NoopMeter.js.map