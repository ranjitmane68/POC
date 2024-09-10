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

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
exports.PeriodicExportingMetricReader = void 0;
var api = require("@opentelemetry/api");
var core_1 = require("@opentelemetry/core");
var MetricReader_1 = require("./MetricReader");
var utils_1 = require("../utils");
var api_1 = require("@opentelemetry/api");
/**
 * {@link MetricReader} which collects metrics based on a user-configurable time interval, and passes the metrics to
 * the configured {@link PushMetricExporter}
 */

var PeriodicExportingMetricReader = function (_MetricReader_1$Metri) {
    _inherits(PeriodicExportingMetricReader, _MetricReader_1$Metri);

    function PeriodicExportingMetricReader(options) {
        _classCallCheck(this, PeriodicExportingMetricReader);

        var _a, _b, _c, _d;

        var _this = _possibleConstructorReturn(this, (PeriodicExportingMetricReader.__proto__ || Object.getPrototypeOf(PeriodicExportingMetricReader)).call(this, {
            aggregationSelector: (_a = options.exporter.selectAggregation) === null || _a === void 0 ? void 0 : _a.bind(options.exporter),
            aggregationTemporalitySelector: (_b = options.exporter.selectAggregationTemporality) === null || _b === void 0 ? void 0 : _b.bind(options.exporter),
            metricProducers: options.metricProducers
        }));

        if (options.exportIntervalMillis !== undefined && options.exportIntervalMillis <= 0) {
            throw Error('exportIntervalMillis must be greater than 0');
        }
        if (options.exportTimeoutMillis !== undefined && options.exportTimeoutMillis <= 0) {
            throw Error('exportTimeoutMillis must be greater than 0');
        }
        if (options.exportTimeoutMillis !== undefined && options.exportIntervalMillis !== undefined && options.exportIntervalMillis < options.exportTimeoutMillis) {
            throw Error('exportIntervalMillis must be greater than or equal to exportTimeoutMillis');
        }
        _this._exportInterval = (_c = options.exportIntervalMillis) !== null && _c !== void 0 ? _c : 60000;
        _this._exportTimeout = (_d = options.exportTimeoutMillis) !== null && _d !== void 0 ? _d : 30000;
        _this._exporter = options.exporter;
        return _this;
    }

    _createClass(PeriodicExportingMetricReader, [{
        key: "_runOnce",
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.prev = 0;
                                _context.next = 3;
                                return (0, utils_1.callWithTimeout)(this._doRun(), this._exportTimeout);

                            case 3:
                                _context.next = 11;
                                break;

                            case 5:
                                _context.prev = 5;
                                _context.t0 = _context["catch"](0);

                                if (!(_context.t0 instanceof utils_1.TimeoutError)) {
                                    _context.next = 10;
                                    break;
                                }

                                api.diag.error('Export took longer than %s milliseconds and timed out.', this._exportTimeout);
                                return _context.abrupt("return");

                            case 10:
                                (0, core_1.globalErrorHandler)(_context.t0);

                            case 11:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[0, 5]]);
            }));

            function _runOnce() {
                return _ref.apply(this, arguments);
            }

            return _runOnce;
        }()
    }, {
        key: "_doRun",
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                var _this2 = this;

                var _a, _b, _ref3, resourceMetrics, errors, _api$diag, doExport;

                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.collect({
                                    timeoutMillis: this._exportTimeout
                                });

                            case 2:
                                _ref3 = _context3.sent;
                                resourceMetrics = _ref3.resourceMetrics;
                                errors = _ref3.errors;

                                if (errors.length > 0) {
                                    (_api$diag = api.diag).error.apply(_api$diag, ['PeriodicExportingMetricReader: metrics collection errors'].concat(_toConsumableArray(errors)));
                                }

                                doExport = function () {
                                    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                                        var result;
                                        return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                            while (1) {
                                                switch (_context2.prev = _context2.next) {
                                                    case 0:
                                                        _context2.next = 2;
                                                        return core_1.internal._export(_this2._exporter, resourceMetrics);

                                                    case 2:
                                                        result = _context2.sent;

                                                        if (!(result.code !== core_1.ExportResultCode.SUCCESS)) {
                                                            _context2.next = 5;
                                                            break;
                                                        }

                                                        throw new Error("PeriodicExportingMetricReader: metrics export failed (error " + result.error + ")");

                                                    case 5:
                                                    case "end":
                                                        return _context2.stop();
                                                }
                                            }
                                        }, _callee2, _this2);
                                    }));

                                    return function doExport() {
                                        return _ref4.apply(this, arguments);
                                    };
                                }();
                                // Avoid scheduling a promise to make the behavior more predictable and easier to test


                                if (!resourceMetrics.resource.asyncAttributesPending) {
                                    _context3.next = 11;
                                    break;
                                }

                                (_b = (_a = resourceMetrics.resource).waitForAsyncAttributes) === null || _b === void 0 ? void 0 : _b.call(_a).then(doExport, function (err) {
                                    return api_1.diag.debug('Error while resolving async portion of resource: ', err);
                                });
                                _context3.next = 13;
                                break;

                            case 11:
                                _context3.next = 13;
                                return doExport();

                            case 13:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function _doRun() {
                return _ref2.apply(this, arguments);
            }

            return _doRun;
        }()
    }, {
        key: "onInitialized",
        value: function onInitialized() {
            var _this3 = this;

            // start running the interval as soon as this reader is initialized and keep handle for shutdown.
            this._interval = setInterval(function () {
                // this._runOnce never rejects. Using void operator to suppress @typescript-eslint/no-floating-promises.
                void _this3._runOnce();
            }, this._exportInterval);
            (0, core_1.unrefTimer)(this._interval);
        }
    }, {
        key: "onForceFlush",
        value: function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this._runOnce();

                            case 2:
                                _context4.next = 4;
                                return this._exporter.forceFlush();

                            case 4:
                            case "end":
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function onForceFlush() {
                return _ref5.apply(this, arguments);
            }

            return onForceFlush;
        }()
    }, {
        key: "onShutdown",
        value: function () {
            var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                if (this._interval) {
                                    clearInterval(this._interval);
                                }
                                _context5.next = 3;
                                return this._exporter.shutdown();

                            case 3:
                            case "end":
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function onShutdown() {
                return _ref6.apply(this, arguments);
            }

            return onShutdown;
        }()
    }]);

    return PeriodicExportingMetricReader;
}(MetricReader_1.MetricReader);

exports.PeriodicExportingMetricReader = PeriodicExportingMetricReader;
//# sourceMappingURL=PeriodicExportingMetricReader.js.map