'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BatchObservableResultImpl = exports.ObservableResultImpl = undefined;

var _api = require('@opentelemetry/api');

var _HashMap = require('./state/HashMap');

var _Instruments = require('./Instruments');

/**
 * The class implements {@link ObservableResult} interface.
 */
var ObservableResultImpl = /** @class */function () {
    function ObservableResultImpl(_instrumentName, _valueType) {
        this._instrumentName = _instrumentName;
        this._valueType = _valueType;
        /**
         * @internal
         */
        this._buffer = new _HashMap.AttributeHashMap();
    }
    /**
     * Observe a measurement of the value associated with the given attributes.
     */
    ObservableResultImpl.prototype.observe = function (value, attributes) {
        if (attributes === void 0) {
            attributes = {};
        }
        if (typeof value !== 'number') {
            _api.diag.warn("non-number value provided to metric " + this._instrumentName + ": " + value);
            return;
        }
        if (this._valueType === _api.ValueType.INT && !Number.isInteger(value)) {
            _api.diag.warn("INT value type cannot accept a floating-point value for " + this._instrumentName + ", ignoring the fractional digits.");
            value = Math.trunc(value);
            // ignore non-finite values.
            if (!Number.isInteger(value)) {
                return;
            }
        }
        this._buffer.set(attributes, value);
    };
    return ObservableResultImpl;
}(); /*
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
exports.ObservableResultImpl = ObservableResultImpl;
/**
 * The class implements {@link BatchObservableCallback} interface.
 */

var BatchObservableResultImpl = /** @class */function () {
    function BatchObservableResultImpl() {
        /**
         * @internal
         */
        this._buffer = new Map();
    }
    /**
     * Observe a measurement of the value associated with the given attributes.
     */
    BatchObservableResultImpl.prototype.observe = function (metric, value, attributes) {
        if (attributes === void 0) {
            attributes = {};
        }
        if (!(0, _Instruments.isObservableInstrument)(metric)) {
            return;
        }
        var map = this._buffer.get(metric);
        if (map == null) {
            map = new _HashMap.AttributeHashMap();
            this._buffer.set(metric, map);
        }
        if (typeof value !== 'number') {
            _api.diag.warn("non-number value provided to metric " + metric._descriptor.name + ": " + value);
            return;
        }
        if (metric._descriptor.valueType === _api.ValueType.INT && !Number.isInteger(value)) {
            _api.diag.warn("INT value type cannot accept a floating-point value for " + metric._descriptor.name + ", ignoring the fractional digits.");
            value = Math.trunc(value);
            // ignore non-finite values.
            if (!Number.isInteger(value)) {
                return;
            }
        }
        map.set(attributes, value);
    };
    return BatchObservableResultImpl;
}();
exports.BatchObservableResultImpl = BatchObservableResultImpl;
//# sourceMappingURL=ObservableResult.js.map