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

/**
 * Async function to execute patched function and being able to catch errors
 * @param execute - function to be executed
 * @param onFinish - callback to run when execute finishes
 */
var safeExecuteInTheMiddleAsync = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(execute, onFinish, preventThrowingError) {
        var error, result;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        error = void 0;
                        result = void 0;
                        _context.prev = 2;
                        _context.next = 5;
                        return execute();

                    case 5:
                        result = _context.sent;
                        _context.next = 11;
                        break;

                    case 8:
                        _context.prev = 8;
                        _context.t0 = _context["catch"](2);

                        error = _context.t0;

                    case 11:
                        _context.prev = 11;

                        onFinish(error, result);

                        if (!(error && !preventThrowingError)) {
                            _context.next = 15;
                            break;
                        }

                        throw error;

                    case 15:
                        return _context.abrupt("return", result);

                    case 17:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this, [[2, 8, 11, 17]]);
    }));

    return function safeExecuteInTheMiddleAsync(_x, _x2, _x3) {
        return _ref.apply(this, arguments);
    };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

Object.defineProperty(exports, "__esModule", { value: true });
exports.isWrapped = exports.safeExecuteInTheMiddleAsync = exports.safeExecuteInTheMiddle = void 0;
/**
 * function to execute patched function and being able to catch errors
 * @param execute - function to be executed
 * @param onFinish - callback to run when execute finishes
 */
function safeExecuteInTheMiddle(execute, onFinish, preventThrowingError) {
    var error = void 0;
    var result = void 0;
    try {
        result = execute();
    } catch (e) {
        error = e;
    } finally {
        onFinish(error, result);
        if (error && !preventThrowingError) {
            // eslint-disable-next-line no-unsafe-finally
            throw error;
        }
        // eslint-disable-next-line no-unsafe-finally
        return result;
    }
}
exports.safeExecuteInTheMiddle = safeExecuteInTheMiddle;
exports.safeExecuteInTheMiddleAsync = safeExecuteInTheMiddleAsync;
/**
 * Checks if certain function has been already wrapped
 * @param func
 */
function isWrapped(func) {
    return typeof func === 'function' && typeof func.__original === 'function' && typeof func.__unwrap === 'function' && func.__wrapped === true;
}
exports.isWrapped = isWrapped;
//# sourceMappingURL=utils.js.map