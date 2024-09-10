'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MetricReader = undefined;

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


var _api = require('@opentelemetry/api');

var api = _interopRequireWildcard(_api);

var _utils = require('../utils');

var _AggregationSelector = require('./AggregationSelector');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * A registered reader of metrics that, when linked to a {@link MetricProducer}, offers global
 * control over metrics.
 */
var MetricReader = exports.MetricReader = function () {
    function MetricReader(options) {
        _classCallCheck(this, MetricReader);

        var _a, _b, _c;
        // Tracks the shutdown state.
        // TODO: use BindOncePromise here once a new version of @opentelemetry/core is available.
        this._shutdown = false;
        this._aggregationSelector = (_a = options === null || options === void 0 ? void 0 : options.aggregationSelector) !== null && _a !== void 0 ? _a : _AggregationSelector.DEFAULT_AGGREGATION_SELECTOR;
        this._aggregationTemporalitySelector = (_b = options === null || options === void 0 ? void 0 : options.aggregationTemporalitySelector) !== null && _b !== void 0 ? _b : _AggregationSelector.DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR;
        this._metricProducers = (_c = options === null || options === void 0 ? void 0 : options.metricProducers) !== null && _c !== void 0 ? _c : [];
    }
    /**
     * Set the {@link MetricProducer} used by this instance. **This should only be called by the
     * SDK and should be considered internal.**
     *
     * To add additional {@link MetricProducer}s to a {@link MetricReader}, pass them to the
     * constructor as {@link MetricReaderOptions.metricProducers}.
     *
     * @internal
     * @param metricProducer
     */


    _createClass(MetricReader, [{
        key: 'setMetricProducer',
        value: function setMetricProducer(metricProducer) {
            if (this._sdkMetricProducer) {
                throw new Error('MetricReader can not be bound to a MeterProvider again.');
            }
            this._sdkMetricProducer = metricProducer;
            this.onInitialized();
        }
        /**
         * Select the {@link Aggregation} for the given {@link InstrumentType} for this
         * reader.
         */

    }, {
        key: 'selectAggregation',
        value: function selectAggregation(instrumentType) {
            return this._aggregationSelector(instrumentType);
        }
        /**
         * Select the {@link AggregationTemporality} for the given
         * {@link InstrumentType} for this reader.
         */

    }, {
        key: 'selectAggregationTemporality',
        value: function selectAggregationTemporality(instrumentType) {
            return this._aggregationTemporalitySelector(instrumentType);
        }
        /**
         * Handle once the SDK has initialized this {@link MetricReader}
         * Overriding this method is optional.
         */

    }, {
        key: 'onInitialized',
        value: function onInitialized() {}
        // Default implementation is empty.

        /**
         * Collect all metrics from the associated {@link MetricProducer}
         */

    }, {
        key: 'collect',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(options) {
                var _ref2, _ref3, sdkCollectionResults, additionalCollectionResults, errors, resource, scopeMetrics;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                if (!(this._sdkMetricProducer === undefined)) {
                                    _context.next = 2;
                                    break;
                                }

                                throw new Error('MetricReader is not bound to a MetricProducer');

                            case 2:
                                if (!this._shutdown) {
                                    _context.next = 4;
                                    break;
                                }

                                throw new Error('MetricReader is shutdown');

                            case 4:
                                _context.next = 6;
                                return Promise.all([this._sdkMetricProducer.collect({
                                    timeoutMillis: options === null || options === void 0 ? void 0 : options.timeoutMillis
                                })].concat(_toConsumableArray(this._metricProducers.map(function (producer) {
                                    return producer.collect({
                                        timeoutMillis: options === null || options === void 0 ? void 0 : options.timeoutMillis
                                    });
                                }))));

                            case 6:
                                _ref2 = _context.sent;
                                _ref3 = _toArray(_ref2);
                                sdkCollectionResults = _ref3[0];
                                additionalCollectionResults = _ref3.slice(1);

                                // Merge the results, keeping the SDK's Resource
                                errors = sdkCollectionResults.errors.concat((0, _utils.FlatMap)(additionalCollectionResults, function (result) {
                                    return result.errors;
                                }));
                                resource = sdkCollectionResults.resourceMetrics.resource;
                                scopeMetrics = sdkCollectionResults.resourceMetrics.scopeMetrics.concat((0, _utils.FlatMap)(additionalCollectionResults, function (result) {
                                    return result.resourceMetrics.scopeMetrics;
                                }));
                                return _context.abrupt('return', {
                                    resourceMetrics: {
                                        resource: resource,
                                        scopeMetrics: scopeMetrics
                                    },
                                    errors: errors
                                });

                            case 14:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function collect(_x) {
                return _ref.apply(this, arguments);
            }

            return collect;
        }()
        /**
         * Shuts down the metric reader, the promise will reject after the optional timeout or resolve after completion.
         *
         * <p> NOTE: this operation will continue even after the promise rejects due to a timeout.
         * @param options options with timeout.
         */

    }, {
        key: 'shutdown',
        value: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(options) {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                if (!this._shutdown) {
                                    _context2.next = 3;
                                    break;
                                }

                                api.diag.error('Cannot call shutdown twice.');
                                return _context2.abrupt('return');

                            case 3:
                                if (!((options === null || options === void 0 ? void 0 : options.timeoutMillis) == null)) {
                                    _context2.next = 8;
                                    break;
                                }

                                _context2.next = 6;
                                return this.onShutdown();

                            case 6:
                                _context2.next = 10;
                                break;

                            case 8:
                                _context2.next = 10;
                                return (0, _utils.callWithTimeout)(this.onShutdown(), options.timeoutMillis);

                            case 10:
                                this._shutdown = true;

                            case 11:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function shutdown(_x2) {
                return _ref4.apply(this, arguments);
            }

            return shutdown;
        }()
        /**
         * Flushes metrics read by this reader, the promise will reject after the optional timeout or resolve after completion.
         *
         * <p> NOTE: this operation will continue even after the promise rejects due to a timeout.
         * @param options options with timeout.
         */

    }, {
        key: 'forceFlush',
        value: function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(options) {
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                if (!this._shutdown) {
                                    _context3.next = 3;
                                    break;
                                }

                                api.diag.warn('Cannot forceFlush on already shutdown MetricReader.');
                                return _context3.abrupt('return');

                            case 3:
                                if (!((options === null || options === void 0 ? void 0 : options.timeoutMillis) == null)) {
                                    _context3.next = 7;
                                    break;
                                }

                                _context3.next = 6;
                                return this.onForceFlush();

                            case 6:
                                return _context3.abrupt('return');

                            case 7:
                                _context3.next = 9;
                                return (0, _utils.callWithTimeout)(this.onForceFlush(), options.timeoutMillis);

                            case 9:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function forceFlush(_x3) {
                return _ref5.apply(this, arguments);
            }

            return forceFlush;
        }()
    }]);

    return MetricReader;
}();
//# sourceMappingURL=MetricReader.js.map