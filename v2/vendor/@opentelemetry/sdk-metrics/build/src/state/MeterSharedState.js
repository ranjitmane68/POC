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

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
exports.MeterSharedState = void 0;
var InstrumentDescriptor_1 = require("../InstrumentDescriptor");
var Meter_1 = require("../Meter");
var utils_1 = require("../utils");
var AsyncMetricStorage_1 = require("./AsyncMetricStorage");
var MetricStorageRegistry_1 = require("./MetricStorageRegistry");
var MultiWritableMetricStorage_1 = require("./MultiWritableMetricStorage");
var ObservableRegistry_1 = require("./ObservableRegistry");
var SyncMetricStorage_1 = require("./SyncMetricStorage");
var AttributesProcessor_1 = require("../view/AttributesProcessor");
/**
 * An internal record for shared meter provider states.
 */

var MeterSharedState = function () {
    function MeterSharedState(_meterProviderSharedState, _instrumentationScope) {
        _classCallCheck(this, MeterSharedState);

        this._meterProviderSharedState = _meterProviderSharedState;
        this._instrumentationScope = _instrumentationScope;
        this.metricStorageRegistry = new MetricStorageRegistry_1.MetricStorageRegistry();
        this.observableRegistry = new ObservableRegistry_1.ObservableRegistry();
        this.meter = new Meter_1.Meter(this);
    }

    _createClass(MeterSharedState, [{
        key: "registerMetricStorage",
        value: function registerMetricStorage(descriptor) {
            var storages = this._registerMetricStorage(descriptor, SyncMetricStorage_1.SyncMetricStorage);
            if (storages.length === 1) {
                return storages[0];
            }
            return new MultiWritableMetricStorage_1.MultiMetricStorage(storages);
        }
    }, {
        key: "registerAsyncMetricStorage",
        value: function registerAsyncMetricStorage(descriptor) {
            var storages = this._registerMetricStorage(descriptor, AsyncMetricStorage_1.AsyncMetricStorage);
            return storages;
        }
        /**
         * @param collector opaque handle of {@link MetricCollector} which initiated the collection.
         * @param collectionTime the HrTime at which the collection was initiated.
         * @param options options for collection.
         * @returns the list of metric data collected.
         */

    }, {
        key: "collect",
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(collector, collectionTime, options) {
                var errors, storages, metricDataList;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.observableRegistry.observe(collectionTime, options === null || options === void 0 ? void 0 : options.timeoutMillis);

                            case 2:
                                errors = _context.sent;
                                storages = this.metricStorageRegistry.getStorages(collector);
                                // prevent more allocations if there are no storages.

                                if (!(storages.length === 0)) {
                                    _context.next = 6;
                                    break;
                                }

                                return _context.abrupt("return", null);

                            case 6:
                                metricDataList = storages.map(function (metricStorage) {
                                    return metricStorage.collect(collector, collectionTime);
                                }).filter(utils_1.isNotNullish);
                                // skip this scope if no data was collected (storage created, but no data observed)

                                if (!(metricDataList.length === 0)) {
                                    _context.next = 9;
                                    break;
                                }

                                return _context.abrupt("return", { errors: errors });

                            case 9:
                                return _context.abrupt("return", {
                                    scopeMetrics: {
                                        scope: this._instrumentationScope,
                                        metrics: metricDataList
                                    },
                                    errors: errors
                                });

                            case 10:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function collect(_x, _x2, _x3) {
                return _ref.apply(this, arguments);
            }

            return collect;
        }()
    }, {
        key: "_registerMetricStorage",
        value: function _registerMetricStorage(descriptor, MetricStorageType) {
            var _this = this;

            var views = this._meterProviderSharedState.viewRegistry.findViews(descriptor, this._instrumentationScope);
            var storages = views.map(function (view) {
                var viewDescriptor = (0, InstrumentDescriptor_1.createInstrumentDescriptorWithView)(view, descriptor);
                var compatibleStorage = _this.metricStorageRegistry.findOrUpdateCompatibleStorage(viewDescriptor);
                if (compatibleStorage != null) {
                    return compatibleStorage;
                }
                var aggregator = view.aggregation.createAggregator(viewDescriptor);
                var viewStorage = new MetricStorageType(viewDescriptor, aggregator, view.attributesProcessor, _this._meterProviderSharedState.metricCollectors);
                _this.metricStorageRegistry.register(viewStorage);
                return viewStorage;
            });
            // Fallback to the per-collector aggregations if no view is configured for the instrument.
            if (storages.length === 0) {
                var perCollectorAggregations = this._meterProviderSharedState.selectAggregations(descriptor.type);
                var collectorStorages = perCollectorAggregations.map(function (_ref2) {
                    var _ref3 = _slicedToArray(_ref2, 2),
                        collector = _ref3[0],
                        aggregation = _ref3[1];

                    var compatibleStorage = _this.metricStorageRegistry.findOrUpdateCompatibleCollectorStorage(collector, descriptor);
                    if (compatibleStorage != null) {
                        return compatibleStorage;
                    }
                    var aggregator = aggregation.createAggregator(descriptor);
                    var storage = new MetricStorageType(descriptor, aggregator, AttributesProcessor_1.AttributesProcessor.Noop(), [collector]);
                    _this.metricStorageRegistry.registerForCollector(collector, storage);
                    return storage;
                });
                storages = storages.concat(collectorStorages);
            }
            return storages;
        }
    }]);

    return MeterSharedState;
}();

exports.MeterSharedState = MeterSharedState;
//# sourceMappingURL=MeterSharedState.js.map