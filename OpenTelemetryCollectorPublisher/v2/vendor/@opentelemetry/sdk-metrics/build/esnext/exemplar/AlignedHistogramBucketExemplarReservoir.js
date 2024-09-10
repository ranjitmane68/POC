'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AlignedHistogramBucketExemplarReservoir = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ExemplarReservoir = require('./ExemplarReservoir');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
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
 * AlignedHistogramBucketExemplarReservoir takes the same boundaries
 * configuration of a Histogram. This algorithm keeps the last seen measurement
 * that falls within a histogram bucket.
 */
var AlignedHistogramBucketExemplarReservoir = exports.AlignedHistogramBucketExemplarReservoir = function (_FixedSizeExemplarRes) {
    _inherits(AlignedHistogramBucketExemplarReservoir, _FixedSizeExemplarRes);

    function AlignedHistogramBucketExemplarReservoir(boundaries) {
        _classCallCheck(this, AlignedHistogramBucketExemplarReservoir);

        var _this = _possibleConstructorReturn(this, (AlignedHistogramBucketExemplarReservoir.__proto__ || Object.getPrototypeOf(AlignedHistogramBucketExemplarReservoir)).call(this, boundaries.length + 1));

        _this._boundaries = boundaries;
        return _this;
    }

    _createClass(AlignedHistogramBucketExemplarReservoir, [{
        key: '_findBucketIndex',
        value: function _findBucketIndex(value, _timestamp, _attributes, _ctx) {
            for (var i = 0; i < this._boundaries.length; i++) {
                if (value <= this._boundaries[i]) {
                    return i;
                }
            }
            return this._boundaries.length;
        }
    }, {
        key: 'offer',
        value: function offer(value, timestamp, attributes, ctx) {
            var index = this._findBucketIndex(value, timestamp, attributes, ctx);
            this._reservoirStorage[index].offer(value, timestamp, attributes, ctx);
        }
    }]);

    return AlignedHistogramBucketExemplarReservoir;
}(_ExemplarReservoir.FixedSizeExemplarReservoirBase);
//# sourceMappingURL=AlignedHistogramBucketExemplarReservoir.js.map