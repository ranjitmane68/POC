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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableRegistry = void 0;
var api_1 = require("@opentelemetry/api");
var Instruments_1 = require("../Instruments");
var ObservableResult_1 = require("../ObservableResult");
var utils_1 = require("../utils");
/**
 * An internal interface for managing ObservableCallbacks.
 *
 * Every registered callback associated with a set of instruments are be evaluated
 * exactly once during collection prior to reading data for that instrument.
 */

var ObservableRegistry = function () {
    function ObservableRegistry() {
        _classCallCheck(this, ObservableRegistry);

        this._callbacks = [];
        this._batchCallbacks = [];
    }

    _createClass(ObservableRegistry, [{
        key: "addCallback",
        value: function addCallback(callback, instrument) {
            var idx = this._findCallback(callback, instrument);
            if (idx >= 0) {
                return;
            }
            this._callbacks.push({ callback: callback, instrument: instrument });
        }
    }, {
        key: "removeCallback",
        value: function removeCallback(callback, instrument) {
            var idx = this._findCallback(callback, instrument);
            if (idx < 0) {
                return;
            }
            this._callbacks.splice(idx, 1);
        }
    }, {
        key: "addBatchCallback",
        value: function addBatchCallback(callback, instruments) {
            // Create a set of unique instruments.
            var observableInstruments = new Set(instruments.filter(Instruments_1.isObservableInstrument));
            if (observableInstruments.size === 0) {
                api_1.diag.error('BatchObservableCallback is not associated with valid instruments', instruments);
                return;
            }
            var idx = this._findBatchCallback(callback, observableInstruments);
            if (idx >= 0) {
                return;
            }
            this._batchCallbacks.push({ callback: callback, instruments: observableInstruments });
        }
    }, {
        key: "removeBatchCallback",
        value: function removeBatchCallback(callback, instruments) {
            // Create a set of unique instruments.
            var observableInstruments = new Set(instruments.filter(Instruments_1.isObservableInstrument));
            var idx = this._findBatchCallback(callback, observableInstruments);
            if (idx < 0) {
                return;
            }
            this._batchCallbacks.splice(idx, 1);
        }
        /**
         * @returns a promise of rejected reasons for invoking callbacks.
         */

    }, {
        key: "observe",
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(collectionTime, timeoutMillis) {
                var callbackFutures, batchCallbackFutures, results, rejections;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                callbackFutures = this._observeCallbacks(collectionTime, timeoutMillis);
                                batchCallbackFutures = this._observeBatchCallbacks(collectionTime, timeoutMillis);
                                _context.next = 4;
                                return (0, utils_1.PromiseAllSettled)([].concat(_toConsumableArray(callbackFutures), _toConsumableArray(batchCallbackFutures)));

                            case 4:
                                results = _context.sent;
                                rejections = results.filter(utils_1.isPromiseAllSettledRejectionResult).map(function (it) {
                                    return it.reason;
                                });
                                return _context.abrupt("return", rejections);

                            case 7:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function observe(_x, _x2) {
                return _ref.apply(this, arguments);
            }

            return observe;
        }()
    }, {
        key: "_observeCallbacks",
        value: function _observeCallbacks(observationTime, timeoutMillis) {
            var _this = this;

            return this._callbacks.map(function () {
                var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_ref2) {
                    var callback = _ref2.callback,
                        instrument = _ref2.instrument;
                    var observableResult, callPromise;
                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                        while (1) {
                            switch (_context2.prev = _context2.next) {
                                case 0:
                                    observableResult = new ObservableResult_1.ObservableResultImpl(instrument._descriptor.name, instrument._descriptor.valueType);
                                    callPromise = Promise.resolve(callback(observableResult));

                                    if (timeoutMillis != null) {
                                        callPromise = (0, utils_1.callWithTimeout)(callPromise, timeoutMillis);
                                    }
                                    _context2.next = 5;
                                    return callPromise;

                                case 5:
                                    instrument._metricStorages.forEach(function (metricStorage) {
                                        metricStorage.record(observableResult._buffer, observationTime);
                                    });

                                case 6:
                                case "end":
                                    return _context2.stop();
                            }
                        }
                    }, _callee2, _this);
                }));

                return function (_x3) {
                    return _ref3.apply(this, arguments);
                };
            }());
        }
    }, {
        key: "_observeBatchCallbacks",
        value: function _observeBatchCallbacks(observationTime, timeoutMillis) {
            var _this2 = this;

            return this._batchCallbacks.map(function () {
                var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(_ref4) {
                    var callback = _ref4.callback,
                        instruments = _ref4.instruments;
                    var observableResult, callPromise;
                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                        while (1) {
                            switch (_context3.prev = _context3.next) {
                                case 0:
                                    observableResult = new ObservableResult_1.BatchObservableResultImpl();
                                    callPromise = Promise.resolve(callback(observableResult));

                                    if (timeoutMillis != null) {
                                        callPromise = (0, utils_1.callWithTimeout)(callPromise, timeoutMillis);
                                    }
                                    _context3.next = 5;
                                    return callPromise;

                                case 5:
                                    instruments.forEach(function (instrument) {
                                        var buffer = observableResult._buffer.get(instrument);
                                        if (buffer == null) {
                                            return;
                                        }
                                        instrument._metricStorages.forEach(function (metricStorage) {
                                            metricStorage.record(buffer, observationTime);
                                        });
                                    });

                                case 6:
                                case "end":
                                    return _context3.stop();
                            }
                        }
                    }, _callee3, _this2);
                }));

                return function (_x4) {
                    return _ref5.apply(this, arguments);
                };
            }());
        }
    }, {
        key: "_findCallback",
        value: function _findCallback(callback, instrument) {
            return this._callbacks.findIndex(function (record) {
                return record.callback === callback && record.instrument === instrument;
            });
        }
    }, {
        key: "_findBatchCallback",
        value: function _findBatchCallback(callback, instruments) {
            return this._batchCallbacks.findIndex(function (record) {
                return record.callback === callback && (0, utils_1.setEquals)(record.instruments, instruments);
            });
        }
    }]);

    return ObservableRegistry;
}();

exports.ObservableRegistry = ObservableRegistry;
//# sourceMappingURL=ObservableRegistry.js.map