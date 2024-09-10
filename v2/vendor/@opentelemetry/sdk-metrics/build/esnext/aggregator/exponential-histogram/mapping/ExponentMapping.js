'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ExponentMapping = undefined;

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


var _ieee = require('./ieee754');

var ieee754 = _interopRequireWildcard(_ieee);

var _util = require('../util');

var util = _interopRequireWildcard(_util);

var _types = require('./types');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * ExponentMapping implements exponential mapping functions for
 * scales <=0. For scales > 0 LogarithmMapping should be used.
 */
var ExponentMapping = exports.ExponentMapping = function () {
    function ExponentMapping(scale) {
        _classCallCheck(this, ExponentMapping);

        this._shift = -scale;
    }
    /**
     * Maps positive floating point values to indexes corresponding to scale
     * @param value
     * @returns {number} index for provided value at the current scale
     */


    _createClass(ExponentMapping, [{
        key: 'mapToIndex',
        value: function mapToIndex(value) {
            if (value < ieee754.MIN_VALUE) {
                return this._minNormalLowerBoundaryIndex();
            }
            var exp = ieee754.getNormalBase2(value);
            // In case the value is an exact power of two, compute a
            // correction of -1. Note, we are using a custom _rightShift
            // to accommodate a 52-bit argument, which the native bitwise
            // operators do not support
            var correction = this._rightShift(ieee754.getSignificand(value) - 1, ieee754.SIGNIFICAND_WIDTH);
            return exp + correction >> this._shift;
        }
        /**
         * Returns the lower bucket boundary for the given index for scale
         *
         * @param index
         * @returns {number}
         */

    }, {
        key: 'lowerBoundary',
        value: function lowerBoundary(index) {
            var minIndex = this._minNormalLowerBoundaryIndex();
            if (index < minIndex) {
                throw new _types.MappingError('underflow: ' + index + ' is < minimum lower boundary: ' + minIndex);
            }
            var maxIndex = this._maxNormalLowerBoundaryIndex();
            if (index > maxIndex) {
                throw new _types.MappingError('overflow: ' + index + ' is > maximum lower boundary: ' + maxIndex);
            }
            return util.ldexp(1, index << this._shift);
        }
        /**
         * The scale used by this mapping
         * @returns {number}
         */

    }, {
        key: '_minNormalLowerBoundaryIndex',
        value: function _minNormalLowerBoundaryIndex() {
            var index = ieee754.MIN_NORMAL_EXPONENT >> this._shift;
            if (this._shift < 2) {
                index--;
            }
            return index;
        }
    }, {
        key: '_maxNormalLowerBoundaryIndex',
        value: function _maxNormalLowerBoundaryIndex() {
            return ieee754.MAX_NORMAL_EXPONENT >> this._shift;
        }
    }, {
        key: '_rightShift',
        value: function _rightShift(value, shift) {
            return Math.floor(value * Math.pow(2, -shift));
        }
    }, {
        key: 'scale',
        get: function get() {
            if (this._shift === 0) {
                return 0;
            }
            return -this._shift;
        }
    }]);

    return ExponentMapping;
}();
//# sourceMappingURL=ExponentMapping.js.map