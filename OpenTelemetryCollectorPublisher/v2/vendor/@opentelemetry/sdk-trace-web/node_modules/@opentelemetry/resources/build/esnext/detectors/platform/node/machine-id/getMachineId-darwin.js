'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getMachineId = undefined;

var getMachineId = exports.getMachineId = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var result, idLine, parts;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.prev = 0;
                        _context.next = 3;
                        return (0, _execAsync.execAsync)('ioreg -rd1 -c "IOPlatformExpertDevice"');

                    case 3:
                        result = _context.sent;
                        idLine = result.stdout.split('\n').find(function (line) {
                            return line.includes('IOPlatformUUID');
                        });

                        if (idLine) {
                            _context.next = 7;
                            break;
                        }

                        return _context.abrupt('return', '');

                    case 7:
                        parts = idLine.split('" = "');

                        if (!(parts.length === 2)) {
                            _context.next = 10;
                            break;
                        }

                        return _context.abrupt('return', parts[1].slice(0, -1));

                    case 10:
                        _context.next = 15;
                        break;

                    case 12:
                        _context.prev = 12;
                        _context.t0 = _context['catch'](0);

                        _api.diag.debug('error reading machine id: ' + _context.t0);

                    case 15:
                        return _context.abrupt('return', '');

                    case 16:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[0, 12]]);
    }));

    return function getMachineId() {
        return _ref.apply(this, arguments);
    };
}();
//# sourceMappingURL=getMachineId-darwin.js.map


var _execAsync = require('./execAsync');

var _api = require('@opentelemetry/api');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /*
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