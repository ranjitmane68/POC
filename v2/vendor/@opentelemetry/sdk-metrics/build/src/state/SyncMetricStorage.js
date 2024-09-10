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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncMetricStorage = void 0;
var MetricStorage_1 = require("./MetricStorage");
var DeltaMetricProcessor_1 = require("./DeltaMetricProcessor");
var TemporalMetricProcessor_1 = require("./TemporalMetricProcessor");
/**
 * Internal interface.
 *
 * Stores and aggregates {@link MetricData} for synchronous instruments.
 */

var SyncMetricStorage = function (_MetricStorage_1$Metr) {
    _inherits(SyncMetricStorage, _MetricStorage_1$Metr);

    function SyncMetricStorage(instrumentDescriptor, aggregator, _attributesProcessor, collectorHandles) {
        _classCallCheck(this, SyncMetricStorage);

        var _this = _possibleConstructorReturn(this, (SyncMetricStorage.__proto__ || Object.getPrototypeOf(SyncMetricStorage)).call(this, instrumentDescriptor));

        _this._attributesProcessor = _attributesProcessor;
        _this._deltaMetricStorage = new DeltaMetricProcessor_1.DeltaMetricProcessor(aggregator);
        _this._temporalMetricStorage = new TemporalMetricProcessor_1.TemporalMetricProcessor(aggregator, collectorHandles);
        return _this;
    }

    _createClass(SyncMetricStorage, [{
        key: "record",
        value: function record(value, attributes, context, recordTime) {
            attributes = this._attributesProcessor.process(attributes, context);
            this._deltaMetricStorage.record(value, attributes, context, recordTime);
        }
        /**
         * Collects the metrics from this storage.
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

    return SyncMetricStorage;
}(MetricStorage_1.MetricStorage);

exports.SyncMetricStorage = SyncMetricStorage;
//# sourceMappingURL=SyncMetricStorage.js.map