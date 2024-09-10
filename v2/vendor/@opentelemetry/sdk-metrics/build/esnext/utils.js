'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

/**
 * Node.js v12.9 lower and browser compatible `Promise.allSettled`.
 */
var PromiseAllSettled = exports.PromiseAllSettled = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(promises) {
        var _this2 = this;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        return _context2.abrupt('return', Promise.all(promises.map(function () {
                            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(p) {
                                var ret;
                                return regeneratorRuntime.wrap(function _callee$(_context) {
                                    while (1) {
                                        switch (_context.prev = _context.next) {
                                            case 0:
                                                _context.prev = 0;
                                                _context.next = 3;
                                                return p;

                                            case 3:
                                                ret = _context.sent;
                                                return _context.abrupt('return', {
                                                    status: 'fulfilled',
                                                    value: ret
                                                });

                                            case 7:
                                                _context.prev = 7;
                                                _context.t0 = _context['catch'](0);
                                                return _context.abrupt('return', {
                                                    status: 'rejected',
                                                    reason: _context.t0
                                                });

                                            case 10:
                                            case 'end':
                                                return _context.stop();
                                        }
                                    }
                                }, _callee, _this2, [[0, 7]]);
                            }));

                            return function (_x2) {
                                return _ref2.apply(this, arguments);
                            };
                        }())));

                    case 1:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function PromiseAllSettled(_x) {
        return _ref.apply(this, arguments);
    };
}();

exports.isNotNullish = isNotNullish;
exports.hashAttributes = hashAttributes;
exports.instrumentationScopeId = instrumentationScopeId;
exports.callWithTimeout = callWithTimeout;
exports.isPromiseAllSettledRejectionResult = isPromiseAllSettledRejectionResult;
exports.FlatMap = FlatMap;
exports.setEquals = setEquals;
exports.binarySearchLB = binarySearchLB;
exports.equalsCaseInsensitive = equalsCaseInsensitive;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
function isNotNullish(item) {
    return item !== undefined && item !== null;
}
/**
 * Converting the unordered attributes into unique identifier string.
 * @param attributes user provided unordered MetricAttributes.
 */
function hashAttributes(attributes) {
    var keys = Object.keys(attributes);
    if (keys.length === 0) return '';
    // Return a string that is stable on key orders.
    keys = keys.sort();
    return JSON.stringify(keys.map(function (key) {
        return [key, attributes[key]];
    }));
}
/**
 * Converting the instrumentation scope object to a unique identifier string.
 * @param instrumentationScope
 */
function instrumentationScopeId(instrumentationScope) {
    var _a, _b;
    return instrumentationScope.name + ':' + ((_a = instrumentationScope.version) !== null && _a !== void 0 ? _a : '') + ':' + ((_b = instrumentationScope.schemaUrl) !== null && _b !== void 0 ? _b : '');
}
/**
 * Error that is thrown on timeouts.
 */

var TimeoutError = exports.TimeoutError = function (_Error) {
    _inherits(TimeoutError, _Error);

    function TimeoutError(message) {
        _classCallCheck(this, TimeoutError);

        // manually adjust prototype to retain `instanceof` functionality when targeting ES5, see:
        // https://github.com/Microsoft/TypeScript-wiki/blob/main/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        var _this = _possibleConstructorReturn(this, (TimeoutError.__proto__ || Object.getPrototypeOf(TimeoutError)).call(this, message));

        Object.setPrototypeOf(_this, TimeoutError.prototype);
        return _this;
    }

    return TimeoutError;
}(Error);
/**
 * Adds a timeout to a promise and rejects if the specified timeout has elapsed. Also rejects if the specified promise
 * rejects, and resolves if the specified promise resolves.
 *
 * <p> NOTE: this operation will continue even after it throws a {@link TimeoutError}.
 *
 * @param promise promise to use with timeout.
 * @param timeout the timeout in milliseconds until the returned promise is rejected.
 */


function callWithTimeout(promise, timeout) {
    var timeoutHandle = void 0;
    var timeoutPromise = new Promise(function timeoutFunction(_resolve, reject) {
        timeoutHandle = setTimeout(function timeoutHandler() {
            reject(new TimeoutError('Operation timed out.'));
        }, timeout);
    });
    return Promise.race([promise, timeoutPromise]).then(function (result) {
        clearTimeout(timeoutHandle);
        return result;
    }, function (reason) {
        clearTimeout(timeoutHandle);
        throw reason;
    });
}function isPromiseAllSettledRejectionResult(it) {
    return it.status === 'rejected';
}
/**
 * Node.js v11.0 lower and browser compatible `Array.prototype.flatMap`.
 */
function FlatMap(arr, fn) {
    var result = [];
    arr.forEach(function (it) {
        result.push.apply(result, _toConsumableArray(fn(it)));
    });
    return result;
}
function setEquals(lhs, rhs) {
    if (lhs.size !== rhs.size) {
        return false;
    }
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = lhs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var item = _step.value;

            if (!rhs.has(item)) {
                return false;
            }
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

    return true;
}
/**
 * Binary search the sorted array to the find lower bound for the value.
 * @param arr
 * @param value
 * @returns
 */
function binarySearchLB(arr, value) {
    var lo = 0;
    var hi = arr.length - 1;
    while (hi - lo > 1) {
        var mid = Math.trunc((hi + lo) / 2);
        if (arr[mid] <= value) {
            lo = mid;
        } else {
            hi = mid - 1;
        }
    }
    if (arr[hi] <= value) {
        return hi;
    } else if (arr[lo] <= value) {
        return lo;
    }
    return -1;
}
function equalsCaseInsensitive(lhs, rhs) {
    return lhs.toLowerCase() === rhs.toLowerCase();
}
//# sourceMappingURL=utils.js.map