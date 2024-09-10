"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SimpleFixedSizeExemplarReservoir = undefined;

var _ExemplarReservoir = require("./ExemplarReservoir");

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
 * Fixed size reservoir that uses equivalent of naive reservoir sampling
 * algorithm to accept measurements.
 *
 */
var SimpleFixedSizeExemplarReservoir = /** @class */function (_super) {
    __extends(SimpleFixedSizeExemplarReservoir, _super);
    function SimpleFixedSizeExemplarReservoir(size) {
        var _this = _super.call(this, size) || this;
        _this._numMeasurementsSeen = 0;
        return _this;
    }
    SimpleFixedSizeExemplarReservoir.prototype.getRandomInt = function (min, max) {
        //[min, max)
        return Math.floor(Math.random() * (max - min) + min);
    };
    SimpleFixedSizeExemplarReservoir.prototype._findBucketIndex = function (_value, _timestamp, _attributes, _ctx) {
        if (this._numMeasurementsSeen < this._size) return this._numMeasurementsSeen++;
        var index = this.getRandomInt(0, ++this._numMeasurementsSeen);
        return index < this._size ? index : -1;
    };
    SimpleFixedSizeExemplarReservoir.prototype.offer = function (value, timestamp, attributes, ctx) {
        var index = this._findBucketIndex(value, timestamp, attributes, ctx);
        if (index !== -1) {
            this._reservoirStorage[index].offer(value, timestamp, attributes, ctx);
        }
    };
    SimpleFixedSizeExemplarReservoir.prototype.reset = function () {
        this._numMeasurementsSeen = 0;
    };
    return SimpleFixedSizeExemplarReservoir;
}(_ExemplarReservoir.FixedSizeExemplarReservoirBase);
exports.SimpleFixedSizeExemplarReservoir = SimpleFixedSizeExemplarReservoir;
//# sourceMappingURL=SimpleFixedSizeExemplarReservoir.js.map