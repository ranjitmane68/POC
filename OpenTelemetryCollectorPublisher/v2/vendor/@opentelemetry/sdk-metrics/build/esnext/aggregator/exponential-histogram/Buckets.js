"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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
var Buckets = exports.Buckets = function () {
    /**
     * The term index refers to the number of the exponential histogram bucket
     * used to determine its boundaries. The lower boundary of a bucket is
     * determined by base ** index and the upper boundary of a bucket is
     * determined by base ** (index + 1). index values are signed to account
     * for values less than or equal to 1.
     *
     * indexBase is the index of the 0th position in the
     * backing array, i.e., backing[0] is the count
     * in the bucket with index `indexBase`.
     *
     * indexStart is the smallest index value represented
     * in the backing array.
     *
     * indexEnd is the largest index value represented in
     * the backing array.
     */
    function Buckets() {
        var backing = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new BucketsBacking();
        var indexBase = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var indexStart = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var indexEnd = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

        _classCallCheck(this, Buckets);

        this.backing = backing;
        this.indexBase = indexBase;
        this.indexStart = indexStart;
        this.indexEnd = indexEnd;
    }
    /**
     * Offset is the bucket index of the smallest entry in the counts array
     * @returns {number}
     */


    _createClass(Buckets, [{
        key: "counts",

        /**
         * An array of counts, where count[i] carries the count
         * of the bucket at index (offset+i).  count[i] is the count of
         * values greater than base^(offset+i) and less than or equal to
         * base^(offset+i+1).
         * @returns {number} The logical counts based on the backing array
         */
        value: function counts() {
            var _this = this;

            return Array.from({ length: this.length }, function (_, i) {
                return _this.at(i);
            });
        }
        /**
         * At returns the count of the bucket at a position in the logical
         * array of counts.
         * @param position
         * @returns {number}
         */

    }, {
        key: "at",
        value: function at(position) {
            var bias = this.indexBase - this.indexStart;
            if (position < bias) {
                position += this.backing.length;
            }
            position -= bias;
            return this.backing.countAt(position);
        }
        /**
         * incrementBucket increments the backing array index by `increment`
         * @param bucketIndex
         * @param increment
         */

    }, {
        key: "incrementBucket",
        value: function incrementBucket(bucketIndex, increment) {
            this.backing.increment(bucketIndex, increment);
        }
        /**
         * decrementBucket decrements the backing array index by `decrement`
         * if decrement is greater than the current value, it's set to 0.
         * @param bucketIndex
         * @param decrement
         */

    }, {
        key: "decrementBucket",
        value: function decrementBucket(bucketIndex, decrement) {
            this.backing.decrement(bucketIndex, decrement);
        }
        /**
         * trim removes leading and / or trailing zero buckets (which can occur
         * after diffing two histos) and rotates the backing array so that the
         * smallest non-zero index is in the 0th position of the backing array
         */

    }, {
        key: "trim",
        value: function trim() {
            for (var i = 0; i < this.length; i++) {
                if (this.at(i) !== 0) {
                    this.indexStart += i;
                    break;
                } else if (i === this.length - 1) {
                    //the entire array is zeroed out
                    this.indexStart = this.indexEnd = this.indexBase = 0;
                    return;
                }
            }
            for (var _i = this.length - 1; _i >= 0; _i--) {
                if (this.at(_i) !== 0) {
                    this.indexEnd -= this.length - _i - 1;
                    break;
                }
            }
            this._rotate();
        }
        /**
         * downscale first rotates, then collapses 2**`by`-to-1 buckets.
         * @param by
         */

    }, {
        key: "downscale",
        value: function downscale(by) {
            this._rotate();
            var size = 1 + this.indexEnd - this.indexStart;
            var each = 1 << by;
            var inpos = 0;
            var outpos = 0;
            for (var pos = this.indexStart; pos <= this.indexEnd;) {
                var mod = pos % each;
                if (mod < 0) {
                    mod += each;
                }
                for (var i = mod; i < each && inpos < size; i++) {
                    this._relocateBucket(outpos, inpos);
                    inpos++;
                    pos++;
                }
                outpos++;
            }
            this.indexStart >>= by;
            this.indexEnd >>= by;
            this.indexBase = this.indexStart;
        }
        /**
         * Clone returns a deep copy of Buckets
         * @returns {Buckets}
         */

    }, {
        key: "clone",
        value: function clone() {
            return new Buckets(this.backing.clone(), this.indexBase, this.indexStart, this.indexEnd);
        }
        /**
         * _rotate shifts the backing array contents so that indexStart ==
         * indexBase to simplify the downscale logic.
         */

    }, {
        key: "_rotate",
        value: function _rotate() {
            var bias = this.indexBase - this.indexStart;
            if (bias === 0) {
                return;
            } else if (bias > 0) {
                this.backing.reverse(0, this.backing.length);
                this.backing.reverse(0, bias);
                this.backing.reverse(bias, this.backing.length);
            } else {
                // negative bias, this can happen when diffing two histograms
                this.backing.reverse(0, this.backing.length);
                this.backing.reverse(0, this.backing.length + bias);
            }
            this.indexBase = this.indexStart;
        }
        /**
         * _relocateBucket adds the count in counts[src] to counts[dest] and
         * resets count[src] to zero.
         */

    }, {
        key: "_relocateBucket",
        value: function _relocateBucket(dest, src) {
            if (dest === src) {
                return;
            }
            this.incrementBucket(dest, this.backing.emptyBucket(src));
        }
    }, {
        key: "offset",
        get: function get() {
            return this.indexStart;
        }
        /**
         * Buckets is a view into the backing array.
         * @returns {number}
         */

    }, {
        key: "length",
        get: function get() {
            if (this.backing.length === 0) {
                return 0;
            }
            if (this.indexEnd === this.indexStart && this.at(0) === 0) {
                return 0;
            }
            return this.indexEnd - this.indexStart + 1;
        }
    }]);

    return Buckets;
}();
/**
 * BucketsBacking holds the raw buckets and some utility methods to
 * manage them.
 */


var BucketsBacking = function () {
    function BucketsBacking() {
        var _counts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [0];

        _classCallCheck(this, BucketsBacking);

        this._counts = _counts;
    }
    /**
     * length returns the physical size of the backing array, which
     * is >= buckets.length()
     */


    _createClass(BucketsBacking, [{
        key: "countAt",

        /**
         * countAt returns the count in a specific bucket
         */
        value: function countAt(pos) {
            return this._counts[pos];
        }
        /**
         * growTo grows a backing array and copies old entries
         * into their correct new positions.
         */

    }, {
        key: "growTo",
        value: function growTo(newSize, oldPositiveLimit, newPositiveLimit) {
            var tmp = new Array(newSize).fill(0);
            tmp.splice.apply(tmp, [newPositiveLimit, this._counts.length - oldPositiveLimit].concat(_toConsumableArray(this._counts.slice(oldPositiveLimit))));
            tmp.splice.apply(tmp, [0, oldPositiveLimit].concat(_toConsumableArray(this._counts.slice(0, oldPositiveLimit))));
            this._counts = tmp;
        }
        /**
         * reverse the items in the backing array in the range [from, limit).
         */

    }, {
        key: "reverse",
        value: function reverse(from, limit) {
            var num = Math.floor((from + limit) / 2) - from;
            for (var i = 0; i < num; i++) {
                var tmp = this._counts[from + i];
                this._counts[from + i] = this._counts[limit - i - 1];
                this._counts[limit - i - 1] = tmp;
            }
        }
        /**
         * emptyBucket empties the count from a bucket, for
         * moving into another.
         */

    }, {
        key: "emptyBucket",
        value: function emptyBucket(src) {
            var tmp = this._counts[src];
            this._counts[src] = 0;
            return tmp;
        }
        /**
         * increments a bucket by `increment`
         */

    }, {
        key: "increment",
        value: function increment(bucketIndex, _increment) {
            this._counts[bucketIndex] += _increment;
        }
        /**
         * decrements a bucket by `decrement`
         */

    }, {
        key: "decrement",
        value: function decrement(bucketIndex, _decrement) {
            if (this._counts[bucketIndex] >= _decrement) {
                this._counts[bucketIndex] -= _decrement;
            } else {
                // this should not happen, but we're being defensive against
                // negative counts.
                this._counts[bucketIndex] = 0;
            }
        }
        /**
         * clone returns a deep copy of BucketsBacking
         */

    }, {
        key: "clone",
        value: function clone() {
            return new BucketsBacking([].concat(_toConsumableArray(this._counts)));
        }
    }, {
        key: "length",
        get: function get() {
            return this._counts.length;
        }
    }]);

    return BucketsBacking;
}();
//# sourceMappingURL=Buckets.js.map