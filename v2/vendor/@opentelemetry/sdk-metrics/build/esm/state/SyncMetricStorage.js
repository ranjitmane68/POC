"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SyncMetricStorage = undefined;

var _MetricStorage = require("./MetricStorage");

var _DeltaMetricProcessor = require("./DeltaMetricProcessor");

var _TemporalMetricProcessor = require("./TemporalMetricProcessor");

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
var __extends = undefined && undefined.__extends || function () {
    var _extendStatics = function extendStatics(d, b) {
        _extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) {
                if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
            }
        };
        return _extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        _extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();

/**
 * Internal interface.
 *
 * Stores and aggregates {@link MetricData} for synchronous instruments.
 */
var SyncMetricStorage = /** @class */function (_super) {
    __extends(SyncMetricStorage, _super);
    function SyncMetricStorage(instrumentDescriptor, aggregator, _attributesProcessor, collectorHandles) {
        var _this = _super.call(this, instrumentDescriptor) || this;
        _this._attributesProcessor = _attributesProcessor;
        _this._deltaMetricStorage = new _DeltaMetricProcessor.DeltaMetricProcessor(aggregator);
        _this._temporalMetricStorage = new _TemporalMetricProcessor.TemporalMetricProcessor(aggregator, collectorHandles);
        return _this;
    }
    SyncMetricStorage.prototype.record = function (value, attributes, context, recordTime) {
        attributes = this._attributesProcessor.process(attributes, context);
        this._deltaMetricStorage.record(value, attributes, context, recordTime);
    };
    /**
     * Collects the metrics from this storage.
     *
     * Note: This is a stateful operation and may reset any interval-related
     * state for the MetricCollector.
     */
    SyncMetricStorage.prototype.collect = function (collector, collectionTime) {
        var accumulations = this._deltaMetricStorage.collect();
        return this._temporalMetricStorage.buildMetrics(collector, this._instrumentDescriptor, accumulations, collectionTime);
    };
    return SyncMetricStorage;
}(_MetricStorage.MetricStorage);
exports.SyncMetricStorage = SyncMetricStorage;
//# sourceMappingURL=SyncMetricStorage.js.map