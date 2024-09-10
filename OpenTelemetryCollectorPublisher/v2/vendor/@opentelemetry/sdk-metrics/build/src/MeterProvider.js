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

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
exports.MeterProvider = void 0;
var api_1 = require("@opentelemetry/api");
var resources_1 = require("@opentelemetry/resources");
var MeterProviderSharedState_1 = require("./state/MeterProviderSharedState");
var MetricCollector_1 = require("./state/MetricCollector");
/**
 * This class implements the {@link MeterProvider} interface.
 */

var MeterProvider = function () {
    function MeterProvider(options) {
        _classCallCheck(this, MeterProvider);

        var _a;
        this._shutdown = false;
        var resource = resources_1.Resource.default().merge((_a = options === null || options === void 0 ? void 0 : options.resource) !== null && _a !== void 0 ? _a : resources_1.Resource.empty());
        this._sharedState = new MeterProviderSharedState_1.MeterProviderSharedState(resource);
        if ((options === null || options === void 0 ? void 0 : options.views) != null && options.views.length > 0) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = options.views[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var view = _step.value;

                    this._sharedState.viewRegistry.addView(view);
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
        }
        if ((options === null || options === void 0 ? void 0 : options.readers) != null && options.readers.length > 0) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = options.readers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var metricReader = _step2.value;

                    this.addMetricReader(metricReader);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }
    }
    /**
     * Get a meter with the configuration of the MeterProvider.
     */


    _createClass(MeterProvider, [{
        key: "getMeter",
        value: function getMeter(name) {
            var version = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
            var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            // https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/metrics/sdk.md#meter-creation
            if (this._shutdown) {
                api_1.diag.warn('A shutdown MeterProvider cannot provide a Meter');
                return (0, api_1.createNoopMeter)();
            }
            return this._sharedState.getMeterSharedState({
                name: name,
                version: version,
                schemaUrl: options.schemaUrl
            }).meter;
        }
        /**
         * Register a {@link MetricReader} to the meter provider. After the
         * registration, the MetricReader can start metrics collection.
         *
         * <p> NOTE: {@link MetricReader} instances MUST be added before creating any instruments.
         * A {@link MetricReader} instance registered later may receive no or incomplete metric data.
         *
         * @param metricReader the metric reader to be registered.
         *
         * @deprecated This method will be removed in SDK 2.0. Please use
         * {@link MeterProviderOptions.readers} via the {@link MeterProvider} constructor instead
         */

    }, {
        key: "addMetricReader",
        value: function addMetricReader(metricReader) {
            var collector = new MetricCollector_1.MetricCollector(this._sharedState, metricReader);
            metricReader.setMetricProducer(collector);
            this._sharedState.metricCollectors.push(collector);
        }
        /**
         * Flush all buffered data and shut down the MeterProvider and all registered
         * MetricReaders.
         *
         * Returns a promise which is resolved when all flushes are complete.
         */

    }, {
        key: "shutdown",
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(options) {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                if (!this._shutdown) {
                                    _context.next = 3;
                                    break;
                                }

                                api_1.diag.warn('shutdown may only be called once per MeterProvider');
                                return _context.abrupt("return");

                            case 3:
                                this._shutdown = true;
                                _context.next = 6;
                                return Promise.all(this._sharedState.metricCollectors.map(function (collector) {
                                    return collector.shutdown(options);
                                }));

                            case 6:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function shutdown(_x3) {
                return _ref.apply(this, arguments);
            }

            return shutdown;
        }()
        /**
         * Notifies all registered MetricReaders to flush any buffered data.
         *
         * Returns a promise which is resolved when all flushes are complete.
         */

    }, {
        key: "forceFlush",
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(options) {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                if (!this._shutdown) {
                                    _context2.next = 3;
                                    break;
                                }

                                api_1.diag.warn('invalid attempt to force flush after MeterProvider shutdown');
                                return _context2.abrupt("return");

                            case 3:
                                _context2.next = 5;
                                return Promise.all(this._sharedState.metricCollectors.map(function (collector) {
                                    return collector.forceFlush(options);
                                }));

                            case 5:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function forceFlush(_x4) {
                return _ref2.apply(this, arguments);
            }

            return forceFlush;
        }()
    }]);

    return MeterProvider;
}();

exports.MeterProvider = MeterProvider;
//# sourceMappingURL=MeterProvider.js.map