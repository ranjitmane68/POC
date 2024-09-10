'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.toResourceMetrics = toResourceMetrics;
exports.toScopeMetrics = toScopeMetrics;
exports.toMetric = toMetric;

var _api = require('@opentelemetry/api');

var _sdkMetrics = require('@opentelemetry/sdk-metrics');

var _common = require('../common');

var _internal = require('../common/internal');

var _internal2 = require('../resource/internal');

function toResourceMetrics(resourceMetrics, options) {
    var encoder = (0, _common.getOtlpEncoder)(options);
    return {
        resource: (0, _internal2.createResource)(resourceMetrics.resource),
        schemaUrl: undefined,
        scopeMetrics: toScopeMetrics(resourceMetrics.scopeMetrics, encoder)
    };
}
function toScopeMetrics(scopeMetrics, encoder) {
    return Array.from(scopeMetrics.map(function (metrics) {
        return {
            scope: (0, _internal.createInstrumentationScope)(metrics.scope),
            metrics: metrics.metrics.map(function (metricData) {
                return toMetric(metricData, encoder);
            }),
            schemaUrl: metrics.scope.schemaUrl
        };
    }));
}
function toMetric(metricData, encoder) {
    var out = {
        name: metricData.descriptor.name,
        description: metricData.descriptor.description,
        unit: metricData.descriptor.unit
    };
    var aggregationTemporality = toAggregationTemporality(metricData.aggregationTemporality);
    switch (metricData.dataPointType) {
        case _sdkMetrics.DataPointType.SUM:
            out.sum = {
                aggregationTemporality: aggregationTemporality,
                isMonotonic: metricData.isMonotonic,
                dataPoints: toSingularDataPoints(metricData, encoder)
            };
            break;
        case _sdkMetrics.DataPointType.GAUGE:
            out.gauge = {
                dataPoints: toSingularDataPoints(metricData, encoder)
            };
            break;
        case _sdkMetrics.DataPointType.HISTOGRAM:
            out.histogram = {
                aggregationTemporality: aggregationTemporality,
                dataPoints: toHistogramDataPoints(metricData, encoder)
            };
            break;
        case _sdkMetrics.DataPointType.EXPONENTIAL_HISTOGRAM:
            out.exponentialHistogram = {
                aggregationTemporality: aggregationTemporality,
                dataPoints: toExponentialHistogramDataPoints(metricData, encoder)
            };
            break;
    }
    return out;
}
function toSingularDataPoint(dataPoint, valueType, encoder) {
    var out = {
        attributes: (0, _internal.toAttributes)(dataPoint.attributes),
        startTimeUnixNano: encoder.encodeHrTime(dataPoint.startTime),
        timeUnixNano: encoder.encodeHrTime(dataPoint.endTime)
    };
    switch (valueType) {
        case _api.ValueType.INT:
            out.asInt = dataPoint.value;
            break;
        case _api.ValueType.DOUBLE:
            out.asDouble = dataPoint.value;
            break;
    }
    return out;
}
function toSingularDataPoints(metricData, encoder) {
    return metricData.dataPoints.map(function (dataPoint) {
        return toSingularDataPoint(dataPoint, metricData.descriptor.valueType, encoder);
    });
}
function toHistogramDataPoints(metricData, encoder) {
    return metricData.dataPoints.map(function (dataPoint) {
        var histogram = dataPoint.value;
        return {
            attributes: (0, _internal.toAttributes)(dataPoint.attributes),
            bucketCounts: histogram.buckets.counts,
            explicitBounds: histogram.buckets.boundaries,
            count: histogram.count,
            sum: histogram.sum,
            min: histogram.min,
            max: histogram.max,
            startTimeUnixNano: encoder.encodeHrTime(dataPoint.startTime),
            timeUnixNano: encoder.encodeHrTime(dataPoint.endTime)
        };
    });
}
function toExponentialHistogramDataPoints(metricData, encoder) {
    return metricData.dataPoints.map(function (dataPoint) {
        var histogram = dataPoint.value;
        return {
            attributes: (0, _internal.toAttributes)(dataPoint.attributes),
            count: histogram.count,
            min: histogram.min,
            max: histogram.max,
            sum: histogram.sum,
            positive: {
                offset: histogram.positive.offset,
                bucketCounts: histogram.positive.bucketCounts
            },
            negative: {
                offset: histogram.negative.offset,
                bucketCounts: histogram.negative.bucketCounts
            },
            scale: histogram.scale,
            zeroCount: histogram.zeroCount,
            startTimeUnixNano: encoder.encodeHrTime(dataPoint.startTime),
            timeUnixNano: encoder.encodeHrTime(dataPoint.endTime)
        };
    });
}
function toAggregationTemporality(temporality) {
    switch (temporality) {
        case _sdkMetrics.AggregationTemporality.DELTA:
            return 1 /* AGGREGATION_TEMPORALITY_DELTA */;
        case _sdkMetrics.AggregationTemporality.CUMULATIVE:
            return 2 /* AGGREGATION_TEMPORALITY_CUMULATIVE */;
    }
}
//# sourceMappingURL=internal.js.map