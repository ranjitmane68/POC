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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchObservableResultImpl = exports.ObservableResultImpl = void 0;
var api_1 = require("@opentelemetry/api");
var HashMap_1 = require("./state/HashMap");
var Instruments_1 = require("./Instruments");
/**
 * The class implements {@link ObservableResult} interface.
 */

var ObservableResultImpl = function () {
    function ObservableResultImpl(_instrumentName, _valueType) {
        _classCallCheck(this, ObservableResultImpl);

        this._instrumentName = _instrumentName;
        this._valueType = _valueType;
        /**
         * @internal
         */
        this._buffer = new HashMap_1.AttributeHashMap();
    }
    /**
     * Observe a measurement of the value associated with the given attributes.
     */


    _createClass(ObservableResultImpl, [{
        key: "observe",
        value: function observe(value) {
            var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            if (typeof value !== 'number') {
                api_1.diag.warn("non-number value provided to metric " + this._instrumentName + ": " + value);
                return;
            }
            if (this._valueType === api_1.ValueType.INT && !Number.isInteger(value)) {
                api_1.diag.warn("INT value type cannot accept a floating-point value for " + this._instrumentName + ", ignoring the fractional digits.");
                value = Math.trunc(value);
                // ignore non-finite values.
                if (!Number.isInteger(value)) {
                    return;
                }
            }
            this._buffer.set(attributes, value);
        }
    }]);

    return ObservableResultImpl;
}();

exports.ObservableResultImpl = ObservableResultImpl;
/**
 * The class implements {@link BatchObservableCallback} interface.
 */

var BatchObservableResultImpl = function () {
    function BatchObservableResultImpl() {
        _classCallCheck(this, BatchObservableResultImpl);

        /**
         * @internal
         */
        this._buffer = new Map();
    }
    /**
     * Observe a measurement of the value associated with the given attributes.
     */


    _createClass(BatchObservableResultImpl, [{
        key: "observe",
        value: function observe(metric, value) {
            var attributes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            if (!(0, Instruments_1.isObservableInstrument)(metric)) {
                return;
            }
            var map = this._buffer.get(metric);
            if (map == null) {
                map = new HashMap_1.AttributeHashMap();
                this._buffer.set(metric, map);
            }
            if (typeof value !== 'number') {
                api_1.diag.warn("non-number value provided to metric " + metric._descriptor.name + ": " + value);
                return;
            }
            if (metric._descriptor.valueType === api_1.ValueType.INT && !Number.isInteger(value)) {
                api_1.diag.warn("INT value type cannot accept a floating-point value for " + metric._descriptor.name + ", ignoring the fractional digits.");
                value = Math.trunc(value);
                // ignore non-finite values.
                if (!Number.isInteger(value)) {
                    return;
                }
            }
            map.set(attributes, value);
        }
    }]);

    return BatchObservableResultImpl;
}();

exports.BatchObservableResultImpl = BatchObservableResultImpl;
//# sourceMappingURL=ObservableResult.js.map