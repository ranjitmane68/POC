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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncMetricStorage = void 0;
var MetricStorage_1 = require("./MetricStorage");
var DeltaMetricProcessor_1 = require("./DeltaMetricProcessor");
var TemporalMetricProcessor_1 = require("./TemporalMetricProcessor");
var HashMap_1 = require("./HashMap");
/**
 * Internal interface.
 *
 * Stores and aggregates {@link MetricData} for asynchronous instruments.
 */

var AsyncMetricStorage = function (_MetricStorage_1$Metr) {
    _inherits(AsyncMetricStorage, _MetricStorage_1$Metr);

    function AsyncMetricStorage(_instrumentDescriptor, aggregator, _attributesProcessor, collectorHandles) {
        _classCallCheck(this, AsyncMetricStorage);

        var _this = _possibleConstructorReturn(this, (AsyncMetricStorage.__proto__ || Object.getPrototypeOf(AsyncMetricStorage)).call(this, _instrumentDescriptor));

        _this._attributesProcessor = _attributesProcessor;
        _this._deltaMetricStorage = new DeltaMetricProcessor_1.DeltaMetricProcessor(aggregator);
        _this._temporalMetricStorage = new TemporalMetricProcessor_1.TemporalMetricProcessor(aggregator, collectorHandles);
        return _this;
    }

    _createClass(AsyncMetricStorage, [{
        key: "record",
        value: function record(measurements, observationTime) {
            var _this2 = this;

            var processed = new HashMap_1.AttributeHashMap();
            Array.from(measurements.entries()).forEach(function (_ref) {
                var _ref2 = _slicedToArray(_ref, 2),
                    attributes = _ref2[0],
                    value = _ref2[1];

                processed.set(_this2._attributesProcessor.process(attributes), value);
            });
            this._deltaMetricStorage.batchCumulate(processed, observationTime);
        }
        /**
         * Collects the metrics from this storage. The ObservableCallback is invoked
         * during the collection.
         *
         * Note: This is a stateful operation and may reset any interval-related
         * state for the MetricCollector.
         */

    }, {
        key: "collect",
        value: function collect(collector, collectionTime) {
            var accumulations = this._deltaMetricStorage.collect();
            return this._temporalMetricStorage.buildMetrics(collector, this._instrumentDescriptor, accumulations, collectionTime);
        }
    }]);

    return AsyncMetricStorage;
}(MetricStorage_1.MetricStorage);

exports.AsyncMetricStorage = AsyncMetricStorage;
//# sourceMappingURL=AsyncMetricStorage.js.map