'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LogarithmMapping = undefined;

var _ieee = require('./ieee754');

var ieee754 = _interopRequireWildcard(_ieee);

var _util = require('../util');

var util = _interopRequireWildcard(_util);

var _types = require('./types');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * LogarithmMapping implements exponential mapping functions for scale > 0.
 * For scales <= 0 the exponent mapping should be used.
 */
var LogarithmMapping = /** @class */function () {
    function LogarithmMapping(scale) {
        this._scale = scale;
        this._scaleFactor = util.ldexp(Math.LOG2E, scale);
        this._inverseFactor = util.ldexp(Math.LN2, -scale);
    }
    /**
     * Maps positive floating point values to indexes corresponding to scale
     * @param value
     * @returns {number} index for provided value at the current scale
     */
    LogarithmMapping.prototype.mapToIndex = function (value) {
        if (value <= ieee754.MIN_VALUE) {
            return this._minNormalLowerBoundaryIndex() - 1;
        }
        // exact power of two special case
        if (ieee754.getSignificand(value) === 0) {
            var exp = ieee754.getNormalBase2(value);
            return (exp << this._scale) - 1;
        }
        // non-power of two cases. use Math.floor to round the scaled logarithm
        var index = Math.floor(Math.log(value) * this._scaleFactor);
        var maxIndex = this._maxNormalLowerBoundaryIndex();
        if (index >= maxIndex) {
            return maxIndex;
        }
        return index;
    };
    /**
     * Returns the lower bucket boundary for the given index for scale
     *
     * @param index
     * @returns {number}
     */
    LogarithmMapping.prototype.lowerBoundary = function (index) {
        var maxIndex = this._maxNormalLowerBoundaryIndex();
        if (index >= maxIndex) {
            if (index === maxIndex) {
                return 2 * Math.exp((index - (1 << this._scale)) / this._scaleFactor);
            }
            throw new _types.MappingError("overflow: " + index + " is > maximum lower boundary: " + maxIndex);
        }
        var minIndex = this._minNormalLowerBoundaryIndex();
        if (index <= minIndex) {
            if (index === minIndex) {
                return ieee754.MIN_VALUE;
            } else if (index === minIndex - 1) {
                return Math.exp((index + (1 << this._scale)) / this._scaleFactor) / 2;
            }
            throw new _types.MappingError("overflow: " + index + " is < minimum lower boundary: " + minIndex);
        }
        return Math.exp(index * this._inverseFactor);
    };
    Object.defineProperty(LogarithmMapping.prototype, "scale", {
        /**
         * The scale used by this mapping
         * @returns {number}
         */
        get: function get() {
            return this._scale;
        },
        enumerable: false,
        configurable: true
    });
    LogarithmMapping.prototype._minNormalLowerBoundaryIndex = function () {
        return ieee754.MIN_NORMAL_EXPONENT << this._scale;
    };
    LogarithmMapping.prototype._maxNormalLowerBoundaryIndex = function () {
        return (ieee754.MAX_NORMAL_EXPONENT + 1 << this._scale) - 1;
    };
    return LogarithmMapping;
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
exports.LogarithmMapping = LogarithmMapping;
//# sourceMappingURL=LogarithmMapping.js.map