'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SimpleLogRecordProcessor = undefined;

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


var _core = require('@opentelemetry/core');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SimpleLogRecordProcessor = exports.SimpleLogRecordProcessor = function () {
    function SimpleLogRecordProcessor(_exporter) {
        _classCallCheck(this, SimpleLogRecordProcessor);

        this._exporter = _exporter;
        this._shutdownOnce = new _core.BindOnceFuture(this._shutdown, this);
        this._unresolvedExports = new Set();
    }

    _createClass(SimpleLogRecordProcessor, [{
        key: 'onEmit',
        value: function onEmit(logRecord) {
            var _this = this;

            var _a, _b;
            if (this._shutdownOnce.isCalled) {
                return;
            }
            var doExport = function doExport() {
                return _core.internal._export(_this._exporter, [logRecord]).then(function (result) {
                    var _a;
                    if (result.code !== _core.ExportResultCode.SUCCESS) {
                        (0, _core.globalErrorHandler)((_a = result.error) !== null && _a !== void 0 ? _a : new Error('SimpleLogRecordProcessor: log record export failed (status ' + result + ')'));
                    }
                }).catch(_core.globalErrorHandler);
            };
            // Avoid scheduling a promise to make the behavior more predictable and easier to test
            if (logRecord.resource.asyncAttributesPending) {
                var exportPromise = (_b = (_a = logRecord.resource).waitForAsyncAttributes) === null || _b === void 0 ? void 0 : _b.call(_a).then(function () {
                    // Using TS Non-null assertion operator because exportPromise could not be null in here
                    // if waitForAsyncAttributes is not present this code will never be reached
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    _this._unresolvedExports.delete(exportPromise);
                    return doExport();
                }, _core.globalErrorHandler);
                // store the unresolved exports
                if (exportPromise != null) {
                    this._unresolvedExports.add(exportPromise);
                }
            } else {
                void doExport();
            }
        }
    }, {
        key: 'forceFlush',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return Promise.all(Array.from(this._unresolvedExports));

                            case 2:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function forceFlush() {
                return _ref.apply(this, arguments);
            }

            return forceFlush;
        }()
    }, {
        key: 'shutdown',
        value: function shutdown() {
            return this._shutdownOnce.call();
        }
    }, {
        key: '_shutdown',
        value: function _shutdown() {
            return this._exporter.shutdown();
        }
    }]);

    return SimpleLogRecordProcessor;
}();
//# sourceMappingURL=SimpleLogRecordProcessor.js.map