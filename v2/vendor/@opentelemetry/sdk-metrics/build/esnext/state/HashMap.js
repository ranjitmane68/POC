'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AttributeHashMap = exports.HashMap = undefined;

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


var _utils = require('../utils');

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HashMap = exports.HashMap = function () {
    function HashMap(_hash) {
        _classCallCheck(this, HashMap);

        this._hash = _hash;
        this._valueMap = new Map();
        this._keyMap = new Map();
    }

    _createClass(HashMap, [{
        key: 'get',
        value: function get(key, hashCode) {
            hashCode !== null && hashCode !== void 0 ? hashCode : hashCode = this._hash(key);
            return this._valueMap.get(hashCode);
        }
    }, {
        key: 'getOrDefault',
        value: function getOrDefault(key, defaultFactory) {
            var hash = this._hash(key);
            if (this._valueMap.has(hash)) {
                return this._valueMap.get(hash);
            }
            var val = defaultFactory();
            if (!this._keyMap.has(hash)) {
                this._keyMap.set(hash, key);
            }
            this._valueMap.set(hash, val);
            return val;
        }
    }, {
        key: 'set',
        value: function set(key, value, hashCode) {
            hashCode !== null && hashCode !== void 0 ? hashCode : hashCode = this._hash(key);
            if (!this._keyMap.has(hashCode)) {
                this._keyMap.set(hashCode, key);
            }
            this._valueMap.set(hashCode, value);
        }
    }, {
        key: 'has',
        value: function has(key, hashCode) {
            hashCode !== null && hashCode !== void 0 ? hashCode : hashCode = this._hash(key);
            return this._valueMap.has(hashCode);
        }
    }, {
        key: 'keys',
        value: /*#__PURE__*/regeneratorRuntime.mark(function keys() {
            var keyIterator, next;
            return regeneratorRuntime.wrap(function keys$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            keyIterator = this._keyMap.entries();
                            next = keyIterator.next();

                        case 2:
                            if (!(next.done !== true)) {
                                _context.next = 8;
                                break;
                            }

                            _context.next = 5;
                            return [next.value[1], next.value[0]];

                        case 5:
                            next = keyIterator.next();
                            _context.next = 2;
                            break;

                        case 8:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, keys, this);
        })
    }, {
        key: 'entries',
        value: /*#__PURE__*/regeneratorRuntime.mark(function entries() {
            var valueIterator, next;
            return regeneratorRuntime.wrap(function entries$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            valueIterator = this._valueMap.entries();
                            next = valueIterator.next();

                        case 2:
                            if (!(next.done !== true)) {
                                _context2.next = 8;
                                break;
                            }

                            _context2.next = 5;
                            return [this._keyMap.get(next.value[0]), next.value[1], next.value[0]];

                        case 5:
                            next = valueIterator.next();
                            _context2.next = 2;
                            break;

                        case 8:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, entries, this);
        })
    }, {
        key: 'size',
        get: function get() {
            return this._valueMap.size;
        }
    }]);

    return HashMap;
}();

var AttributeHashMap = exports.AttributeHashMap = function (_HashMap) {
    _inherits(AttributeHashMap, _HashMap);

    function AttributeHashMap() {
        _classCallCheck(this, AttributeHashMap);

        return _possibleConstructorReturn(this, (AttributeHashMap.__proto__ || Object.getPrototypeOf(AttributeHashMap)).call(this, _utils.hashAttributes));
    }

    return AttributeHashMap;
}(HashMap);
//# sourceMappingURL=HashMap.js.map