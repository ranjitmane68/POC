"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ConsoleSpanExporter = undefined;

var _core = require("@opentelemetry/core");

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
var __values = undefined && undefined.__values || function (o) {
    var s = typeof Symbol === "function" && Symbol.iterator,
        m = s && o[s],
        i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function next() {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};

/**
 * This is implementation of {@link SpanExporter} that prints spans to the
 * console. This class can be used for diagnostic purposes.
 */
/* eslint-disable no-console */
var ConsoleSpanExporter = /** @class */function () {
    function ConsoleSpanExporter() {}
    /**
     * Export spans.
     * @param spans
     * @param resultCallback
     */
    ConsoleSpanExporter.prototype.export = function (spans, resultCallback) {
        return this._sendSpans(spans, resultCallback);
    };
    /**
     * Shutdown the exporter.
     */
    ConsoleSpanExporter.prototype.shutdown = function () {
        this._sendSpans([]);
        return this.forceFlush();
    };
    /**
     * Exports any pending spans in exporter
     */
    ConsoleSpanExporter.prototype.forceFlush = function () {
        return Promise.resolve();
    };
    /**
     * converts span info into more readable format
     * @param span
     */
    ConsoleSpanExporter.prototype._exportInfo = function (span) {
        var _a;
        return {
            resource: {
                attributes: span.resource.attributes
            },
            traceId: span.spanContext().traceId,
            parentId: span.parentSpanId,
            traceState: (_a = span.spanContext().traceState) === null || _a === void 0 ? void 0 : _a.serialize(),
            name: span.name,
            id: span.spanContext().spanId,
            kind: span.kind,
            timestamp: (0, _core.hrTimeToMicroseconds)(span.startTime),
            duration: (0, _core.hrTimeToMicroseconds)(span.duration),
            attributes: span.attributes,
            status: span.status,
            events: span.events,
            links: span.links
        };
    };
    /**
     * Showing spans in console
     * @param spans
     * @param done
     */
    ConsoleSpanExporter.prototype._sendSpans = function (spans, done) {
        var e_1, _a;
        try {
            for (var spans_1 = __values(spans), spans_1_1 = spans_1.next(); !spans_1_1.done; spans_1_1 = spans_1.next()) {
                var span = spans_1_1.value;
                console.dir(this._exportInfo(span), { depth: 3 });
            }
        } catch (e_1_1) {
            e_1 = { error: e_1_1 };
        } finally {
            try {
                if (spans_1_1 && !spans_1_1.done && (_a = spans_1.return)) _a.call(spans_1);
            } finally {
                if (e_1) throw e_1.error;
            }
        }
        if (done) {
            return done({ code: _core.ExportResultCode.SUCCESS });
        }
    };
    return ConsoleSpanExporter;
}();
exports.ConsoleSpanExporter = ConsoleSpanExporter;
//# sourceMappingURL=ConsoleSpanExporter.js.map