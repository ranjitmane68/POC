"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AsyncMetricStorage = undefined;

var _MetricStorage = require("./MetricStorage");

var _DeltaMetricProcessor = require("./DeltaMetricProcessor");

var _TemporalMetricProcessor = require("./TemporalMetricProcessor");

var _HashMap = require("./HashMap");

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
var __read = undefined && undefined.__read || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o),
        r,
        ar = [],
        e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) {
            ar.push(r.value);
        }
    } catch (error) {
        e = { error: error };
    } finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        } finally {
            if (e) throw e.error;
        }
    }
    return ar;
};

/**
 * Internal interface.
 *
 * Stores and aggregates {@link MetricData} for asynchronous instruments.
 */
var AsyncMetricStorage = /** @class */function (_super) {
    __extends(AsyncMetricStorage, _super);
    function AsyncMetricStorage(_instrumentDescriptor, aggregator, _attributesProcessor, collectorHandles) {
        var _this = _super.call(this, _instrumentDescriptor) || this;
        _this._attributesProcessor = _attributesProcessor;
        _this._deltaMetricStorage = new _DeltaMetricProcessor.DeltaMetricProcessor(aggregator);
        _this._temporalMetricStorage = new _TemporalMetricProcessor.TemporalMetricProcessor(aggregator, collectorHandles);
        return _this;
    }
    AsyncMetricStorage.prototype.record = function (measurements, observationTime) {
        var _this = this;
        var processed = new _HashMap.AttributeHashMap();
        Array.from(measurements.entries()).forEach(function (_a) {
            var _b = __read(_a, 2),
                attributes = _b[0],
                value = _b[1];
            processed.set(_this._attributesProcessor.process(attributes), value);
        });
        this._deltaMetricStorage.batchCumulate(processed, observationTime);
    };
    /**
     * Collects the metrics from this storage. The ObservableCallback is invoked
     * during the collection.
     *
     * Note: This is a stateful operation and may reset any interval-related
     * state for the MetricCollector.
     */
    AsyncMetricStorage.prototype.collect = function (collector, collectionTime) {
        var accumulations = this._deltaMetricStorage.collect();
        return this._temporalMetricStorage.buildMetrics(collector, this._instrumentDescriptor, accumulations, collectionTime);
    };
    return AsyncMetricStorage;
}(_MetricStorage.MetricStorage);
exports.AsyncMetricStorage = AsyncMetricStorage;
//# sourceMappingURL=AsyncMetricStorage.js.map