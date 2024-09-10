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

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
exports.BaggageImpl = void 0;

var BaggageImpl = function () {
    function BaggageImpl(entries) {
        _classCallCheck(this, BaggageImpl);

        this._entries = entries ? new Map(entries) : new Map();
    }

    _createClass(BaggageImpl, [{
        key: "getEntry",
        value: function getEntry(key) {
            var entry = this._entries.get(key);
            if (!entry) {
                return undefined;
            }
            return Object.assign({}, entry);
        }
    }, {
        key: "getAllEntries",
        value: function getAllEntries() {
            return Array.from(this._entries.entries()).map(function (_ref) {
                var _ref2 = _slicedToArray(_ref, 2),
                    k = _ref2[0],
                    v = _ref2[1];

                return [k, v];
            });
        }
    }, {
        key: "setEntry",
        value: function setEntry(key, entry) {
            var newBaggage = new BaggageImpl(this._entries);
            newBaggage._entries.set(key, entry);
            return newBaggage;
        }
    }, {
        key: "removeEntry",
        value: function removeEntry(key) {
            var newBaggage = new BaggageImpl(this._entries);
            newBaggage._entries.delete(key);
            return newBaggage;
        }
    }, {
        key: "removeEntries",
        value: function removeEntries() {
            var newBaggage = new BaggageImpl(this._entries);

            for (var _len = arguments.length, keys = Array(_len), _key = 0; _key < _len; _key++) {
                keys[_key] = arguments[_key];
            }

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var key = _step.value;

                    newBaggage._entries.delete(key);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return newBaggage;
        }
    }, {
        key: "clear",
        value: function clear() {
            return new BaggageImpl();
        }
    }]);

    return BaggageImpl;
}();

exports.BaggageImpl = BaggageImpl;
//# sourceMappingURL=baggage-impl.js.map