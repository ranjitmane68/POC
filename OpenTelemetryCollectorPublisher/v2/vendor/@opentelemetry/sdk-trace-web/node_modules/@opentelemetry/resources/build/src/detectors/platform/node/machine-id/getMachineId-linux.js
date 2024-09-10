"use strict";

var getMachineId = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var paths, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, path, result;

        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        paths = ['/etc/machine-id', '/var/lib/dbus/machine-id'];
                        _iteratorNormalCompletion = true;
                        _didIteratorError = false;
                        _iteratorError = undefined;
                        _context.prev = 4;
                        _iterator = paths[Symbol.iterator]();

                    case 6:
                        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                            _context.next = 21;
                            break;
                        }

                        path = _step.value;
                        _context.prev = 8;
                        _context.next = 11;
                        return fs_1.promises.readFile(path, { encoding: 'utf8' });

                    case 11:
                        result = _context.sent;
                        return _context.abrupt("return", result.trim());

                    case 15:
                        _context.prev = 15;
                        _context.t0 = _context["catch"](8);

                        api_1.diag.debug("error reading machine id: " + _context.t0);

                    case 18:
                        _iteratorNormalCompletion = true;
                        _context.next = 6;
                        break;

                    case 21:
                        _context.next = 27;
                        break;

                    case 23:
                        _context.prev = 23;
                        _context.t1 = _context["catch"](4);
                        _didIteratorError = true;
                        _iteratorError = _context.t1;

                    case 27:
                        _context.prev = 27;
                        _context.prev = 28;

                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }

                    case 30:
                        _context.prev = 30;

                        if (!_didIteratorError) {
                            _context.next = 33;
                            break;
                        }

                        throw _iteratorError;

                    case 33:
                        return _context.finish(30);

                    case 34:
                        return _context.finish(27);

                    case 35:
                        return _context.abrupt("return", '');

                    case 36:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this, [[4, 23, 27, 35], [8, 15], [28,, 30, 34]]);
    }));

    return function getMachineId() {
        return _ref.apply(this, arguments);
    };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

Object.defineProperty(exports, "__esModule", { value: true });
exports.getMachineId = void 0;
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
var fs_1 = require("fs");
var api_1 = require("@opentelemetry/api");

exports.getMachineId = getMachineId;
//# sourceMappingURL=getMachineId-linux.js.map