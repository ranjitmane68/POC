'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Meter = undefined;

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


var _InstrumentDescriptor = require('./InstrumentDescriptor');

var _Instruments = require('./Instruments');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * This class implements the {@link IMeter} interface.
 */
var Meter = exports.Meter = function () {
  function Meter(_meterSharedState) {
    _classCallCheck(this, Meter);

    this._meterSharedState = _meterSharedState;
  }
  /**
   * Create a {@link Gauge} instrument.
   */


  _createClass(Meter, [{
    key: 'createGauge',
    value: function createGauge(name, options) {
      var descriptor = (0, _InstrumentDescriptor.createInstrumentDescriptor)(name, _InstrumentDescriptor.InstrumentType.GAUGE, options);
      var storage = this._meterSharedState.registerMetricStorage(descriptor);
      return new _Instruments.GaugeInstrument(storage, descriptor);
    }
    /**
     * Create a {@link Histogram} instrument.
     */

  }, {
    key: 'createHistogram',
    value: function createHistogram(name, options) {
      var descriptor = (0, _InstrumentDescriptor.createInstrumentDescriptor)(name, _InstrumentDescriptor.InstrumentType.HISTOGRAM, options);
      var storage = this._meterSharedState.registerMetricStorage(descriptor);
      return new _Instruments.HistogramInstrument(storage, descriptor);
    }
    /**
     * Create a {@link Counter} instrument.
     */

  }, {
    key: 'createCounter',
    value: function createCounter(name, options) {
      var descriptor = (0, _InstrumentDescriptor.createInstrumentDescriptor)(name, _InstrumentDescriptor.InstrumentType.COUNTER, options);
      var storage = this._meterSharedState.registerMetricStorage(descriptor);
      return new _Instruments.CounterInstrument(storage, descriptor);
    }
    /**
     * Create a {@link UpDownCounter} instrument.
     */

  }, {
    key: 'createUpDownCounter',
    value: function createUpDownCounter(name, options) {
      var descriptor = (0, _InstrumentDescriptor.createInstrumentDescriptor)(name, _InstrumentDescriptor.InstrumentType.UP_DOWN_COUNTER, options);
      var storage = this._meterSharedState.registerMetricStorage(descriptor);
      return new _Instruments.UpDownCounterInstrument(storage, descriptor);
    }
    /**
     * Create a {@link ObservableGauge} instrument.
     */

  }, {
    key: 'createObservableGauge',
    value: function createObservableGauge(name, options) {
      var descriptor = (0, _InstrumentDescriptor.createInstrumentDescriptor)(name, _InstrumentDescriptor.InstrumentType.OBSERVABLE_GAUGE, options);
      var storages = this._meterSharedState.registerAsyncMetricStorage(descriptor);
      return new _Instruments.ObservableGaugeInstrument(descriptor, storages, this._meterSharedState.observableRegistry);
    }
    /**
     * Create a {@link ObservableCounter} instrument.
     */

  }, {
    key: 'createObservableCounter',
    value: function createObservableCounter(name, options) {
      var descriptor = (0, _InstrumentDescriptor.createInstrumentDescriptor)(name, _InstrumentDescriptor.InstrumentType.OBSERVABLE_COUNTER, options);
      var storages = this._meterSharedState.registerAsyncMetricStorage(descriptor);
      return new _Instruments.ObservableCounterInstrument(descriptor, storages, this._meterSharedState.observableRegistry);
    }
    /**
     * Create a {@link ObservableUpDownCounter} instrument.
     */

  }, {
    key: 'createObservableUpDownCounter',
    value: function createObservableUpDownCounter(name, options) {
      var descriptor = (0, _InstrumentDescriptor.createInstrumentDescriptor)(name, _InstrumentDescriptor.InstrumentType.OBSERVABLE_UP_DOWN_COUNTER, options);
      var storages = this._meterSharedState.registerAsyncMetricStorage(descriptor);
      return new _Instruments.ObservableUpDownCounterInstrument(descriptor, storages, this._meterSharedState.observableRegistry);
    }
    /**
     * @see {@link Meter.addBatchObservableCallback}
     */

  }, {
    key: 'addBatchObservableCallback',
    value: function addBatchObservableCallback(callback, observables) {
      this._meterSharedState.observableRegistry.addBatchCallback(callback, observables);
    }
    /**
     * @see {@link Meter.removeBatchObservableCallback}
     */

  }, {
    key: 'removeBatchObservableCallback',
    value: function removeBatchObservableCallback(callback, observables) {
      this._meterSharedState.observableRegistry.removeBatchCallback(callback, observables);
    }
  }]);

  return Meter;
}();
//# sourceMappingURL=Meter.js.map