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
exports.MetricCollector = void 0;
var core_1 = require("@opentelemetry/core");
/**
 * An internal opaque interface that the MetricReader receives as
 * MetricProducer. It acts as the storage key to the internal metric stream
 * state for each MetricReader.
 */

var MetricCollector = function () {
    function MetricCollector(_sharedState, _metricReader) {
        _classCallCheck(this, MetricCollector);

        this._sharedState = _sharedState;
        this._metricReader = _metricReader;
    }

    _createClass(MetricCollector, [{
        key: "collect",
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(options) {
                var _this = this;

                var collectionTime, scopeMetrics, errors, meterCollectionPromises;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                collectionTime = (0, core_1.millisToHrTime)(Date.now());
                                scopeMetrics = [];
                                errors = [];
                                meterCollectionPromises = Array.from(this._sharedState.meterSharedStates.values()).map(function () {
                                    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(meterSharedState) {
                                        var current;
                                        return regeneratorRuntime.wrap(function _callee$(_context) {
                                            while (1) {
                                                switch (_context.prev = _context.next) {
                                                    case 0:
                                                        _context.next = 2;
                                                        return meterSharedState.collect(_this, collectionTime, options);

                                                    case 2:
                                                        current = _context.sent;

                                                        // only add scope metrics if available
                                                        if ((current === null || current === void 0 ? void 0 : current.scopeMetrics) != null) {
                                                            scopeMetrics.push(current.scopeMetrics);
                                                        }
                                                        // only add errors if available
                                                        if ((current === null || current === void 0 ? void 0 : current.errors) != null) {
                                                            errors.push.apply(errors, _toConsumableArray(current.errors));
                                                        }

                                                    case 5:
                                                    case "end":
                                                        return _context.stop();
                                                }
                                            }
                                        }, _callee, _this);
                                    }));

                                    return function (_x2) {
                                        return _ref2.apply(this, arguments);
                                    };
                                }());
                                _context2.next = 6;
                                return Promise.all(meterCollectionPromises);

                            case 6:
                                return _context2.abrupt("return", {
                                    resourceMetrics: {
                                        resource: this._sharedState.resource,
                                        scopeMetrics: scopeMetrics
                                    },
                                    errors: errors
                                });

                            case 7:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function collect(_x) {
                return _ref.apply(this, arguments);
            }

            return collect;
        }()
        /**
         * Delegates for MetricReader.forceFlush.
         */

    }, {
        key: "forceFlush",
        value: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(options) {
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this._metricReader.forceFlush(options);

                            case 2:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function forceFlush(_x3) {
                return _ref3.apply(this, arguments);
            }

            return forceFlush;
        }()
        /**
         * Delegates for MetricReader.shutdown.
         */

    }, {
        key: "shutdown",
        value: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(options) {
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this._metricReader.shutdown(options);

                            case 2:
                            case "end":
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function shutdown(_x4) {
                return _ref4.apply(this, arguments);
            }

            return shutdown;
        }()
    }, {
        key: "selectAggregationTemporality",
        value: function selectAggregationTemporality(instrumentType) {
            return this._metricReader.selectAggregationTemporality(instrumentType);
        }
    }, {
        key: "selectAggregation",
        value: function selectAggregation(instrumentType) {
            return this._metricReader.selectAggregation(instrumentType);
        }
    }]);

    return MetricCollector;
}();

exports.MetricCollector = MetricCollector;
//# sourceMappingURL=MetricCollector.js.map