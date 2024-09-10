'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.sdkSpanToOtlpSpan = sdkSpanToOtlpSpan;
exports.toOtlpLink = toOtlpLink;
exports.toOtlpSpanEvent = toOtlpSpanEvent;

var _internal = require('../common/internal');

function sdkSpanToOtlpSpan(span, encoder) {
    var _a;
    var ctx = span.spanContext();
    var status = span.status;
    return {
        traceId: encoder.encodeSpanContext(ctx.traceId),
        spanId: encoder.encodeSpanContext(ctx.spanId),
        parentSpanId: encoder.encodeOptionalSpanContext(span.parentSpanId),
        traceState: (_a = ctx.traceState) === null || _a === void 0 ? void 0 : _a.serialize(),
        name: span.name,
        // Span kind is offset by 1 because the API does not define a value for unset
        kind: span.kind == null ? 0 : span.kind + 1,
        startTimeUnixNano: encoder.encodeHrTime(span.startTime),
        endTimeUnixNano: encoder.encodeHrTime(span.endTime),
        attributes: (0, _internal.toAttributes)(span.attributes),
        droppedAttributesCount: span.droppedAttributesCount,
        events: span.events.map(function (event) {
            return toOtlpSpanEvent(event, encoder);
        }),
        droppedEventsCount: span.droppedEventsCount,
        status: {
            // API and proto enums share the same values
            code: status.code,
            message: status.message
        },
        links: span.links.map(function (link) {
            return toOtlpLink(link, encoder);
        }),
        droppedLinksCount: span.droppedLinksCount
    };
}
function toOtlpLink(link, encoder) {
    var _a;
    return {
        attributes: link.attributes ? (0, _internal.toAttributes)(link.attributes) : [],
        spanId: encoder.encodeSpanContext(link.context.spanId),
        traceId: encoder.encodeSpanContext(link.context.traceId),
        traceState: (_a = link.context.traceState) === null || _a === void 0 ? void 0 : _a.serialize(),
        droppedAttributesCount: link.droppedAttributesCount || 0
    };
}
function toOtlpSpanEvent(timedEvent, encoder) {
    return {
        attributes: timedEvent.attributes ? (0, _internal.toAttributes)(timedEvent.attributes) : [],
        name: timedEvent.name,
        timeUnixNano: encoder.encodeHrTime(timedEvent.time),
        droppedAttributesCount: timedEvent.droppedAttributesCount || 0
    };
}
//# sourceMappingURL=internal.js.map