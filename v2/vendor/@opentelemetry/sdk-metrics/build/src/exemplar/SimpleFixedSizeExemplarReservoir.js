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

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleFixedSizeExemplarReservoir = void 0;
var ExemplarReservoir_1 = require("./ExemplarReservoir");
/**
 * Fixed size reservoir that uses equivalent of naive reservoir sampling
 * algorithm to accept measurements.
 *
 */

var SimpleFixedSizeExemplarReservoir = function (_ExemplarReservoir_1$) {
    _inherits(SimpleFixedSizeExemplarReservoir, _ExemplarReservoir_1$);

    function SimpleFixedSizeExemplarReservoir(size) {
        _classCallCheck(this, SimpleFixedSizeExemplarReservoir);

        var _this = _possibleConstructorReturn(this, (SimpleFixedSizeExemplarReservoir.__proto__ || Object.getPrototypeOf(SimpleFixedSizeExemplarReservoir)).call(this, size));

        _this._numMeasurementsSeen = 0;
        return _this;
    }

    _createClass(SimpleFixedSizeExemplarReservoir, [{
        key: "getRandomInt",
        value: function getRandomInt(min, max) {
            //[min, max)
            return Math.floor(Math.random() * (max - min) + min);
        }
    }, {
        key: "_findBucketIndex",
        value: function _findBucketIndex(_value, _timestamp, _attributes, _ctx) {
            if (this._numMeasurementsSeen < this._size) return this._numMeasurementsSeen++;
            var index = this.getRandomInt(0, ++this._numMeasurementsSeen);
            return index < this._size ? index : -1;
        }
    }, {
        key: "offer",
        value: function offer(value, timestamp, attributes, ctx) {
            var index = this._findBucketIndex(value, timestamp, attributes, ctx);
            if (index !== -1) {
                this._reservoirStorage[index].offer(value, timestamp, attributes, ctx);
            }
        }
    }, {
        key: "reset",
        value: function reset() {
            this._numMeasurementsSeen = 0;
        }
    }]);

    return SimpleFixedSizeExemplarReservoir;
}(ExemplarReservoir_1.FixedSizeExemplarReservoirBase);

exports.SimpleFixedSizeExemplarReservoir = SimpleFixedSizeExemplarReservoir;
//# sourceMappingURL=SimpleFixedSizeExemplarReservoir.js.map