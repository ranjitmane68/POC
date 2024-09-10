"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Span = undefined;

var _api = require("@opentelemetry/api");

var _core = require("@opentelemetry/core");

var _semanticConventions = require("@opentelemetry/semantic-conventions");

var _enums = require("./enums");

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
var __spreadArray = undefined && undefined.__spreadArray || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};

/**
 * This class represents a span.
 */
var Span = /** @class */function () {
    /**
     * Constructs a new Span instance.
     *
     * @deprecated calling Span constructor directly is not supported. Please use tracer.startSpan.
     * */
    function Span(parentTracer, context, spanName, spanContext, kind, parentSpanId, links, startTime, _deprecatedClock, // keeping this argument even though it is unused to ensure backwards compatibility
    attributes) {
        if (links === void 0) {
            links = [];
        }
        this.attributes = {};
        this.links = [];
        this.events = [];
        this._droppedAttributesCount = 0;
        this._droppedEventsCount = 0;
        this._droppedLinksCount = 0;
        this.status = {
            code: _api.SpanStatusCode.UNSET
        };
        this.endTime = [0, 0];
        this._ended = false;
        this._duration = [-1, -1];
        this.name = spanName;
        this._spanContext = spanContext;
        this.parentSpanId = parentSpanId;
        this.kind = kind;
        this.links = links;
        var now = Date.now();
        this._performanceStartTime = _core.otperformance.now();
        this._performanceOffset = now - (this._performanceStartTime + (0, _core.getTimeOrigin)());
        this._startTimeProvided = startTime != null;
        this.startTime = this._getTime(startTime !== null && startTime !== void 0 ? startTime : now);
        this.resource = parentTracer.resource;
        this.instrumentationLibrary = parentTracer.instrumentationLibrary;
        this._spanLimits = parentTracer.getSpanLimits();
        this._attributeValueLengthLimit = this._spanLimits.attributeValueLengthLimit || 0;
        if (attributes != null) {
            this.setAttributes(attributes);
        }
        this._spanProcessor = parentTracer.getActiveSpanProcessor();
        this._spanProcessor.onStart(this, context);
    }
    Span.prototype.spanContext = function () {
        return this._spanContext;
    };
    Span.prototype.setAttribute = function (key, value) {
        if (value == null || this._isSpanEnded()) return this;
        if (key.length === 0) {
            _api.diag.warn("Invalid attribute key: " + key);
            return this;
        }
        if (!(0, _core.isAttributeValue)(value)) {
            _api.diag.warn("Invalid attribute value set for key: " + key);
            return this;
        }
        if (Object.keys(this.attributes).length >= this._spanLimits.attributeCountLimit && !Object.prototype.hasOwnProperty.call(this.attributes, key)) {
            this._droppedAttributesCount++;
            return this;
        }
        this.attributes[key] = this._truncateToSize(value);
        return this;
    };
    Span.prototype.setAttributes = function (attributes) {
        var e_1, _a;
        try {
            for (var _b = __values(Object.entries(attributes)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2),
                    k = _d[0],
                    v = _d[1];
                this.setAttribute(k, v);
            }
        } catch (e_1_1) {
            e_1 = { error: e_1_1 };
        } finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            } finally {
                if (e_1) throw e_1.error;
            }
        }
        return this;
    };
    /**
     *
     * @param name Span Name
     * @param [attributesOrStartTime] Span attributes or start time
     *     if type is {@type TimeInput} and 3rd param is undefined
     * @param [timeStamp] Specified time stamp for the event
     */
    Span.prototype.addEvent = function (name, attributesOrStartTime, timeStamp) {
        if (this._isSpanEnded()) return this;
        if (this._spanLimits.eventCountLimit === 0) {
            _api.diag.warn('No events allowed.');
            this._droppedEventsCount++;
            return this;
        }
        if (this.events.length >= this._spanLimits.eventCountLimit) {
            if (this._droppedEventsCount === 0) {
                _api.diag.debug('Dropping extra events.');
            }
            this.events.shift();
            this._droppedEventsCount++;
        }
        if ((0, _core.isTimeInput)(attributesOrStartTime)) {
            if (!(0, _core.isTimeInput)(timeStamp)) {
                timeStamp = attributesOrStartTime;
            }
            attributesOrStartTime = undefined;
        }
        var attributes = (0, _core.sanitizeAttributes)(attributesOrStartTime);
        this.events.push({
            name: name,
            attributes: attributes,
            time: this._getTime(timeStamp),
            droppedAttributesCount: 0
        });
        return this;
    };
    Span.prototype.addLink = function (link) {
        this.links.push(link);
        return this;
    };
    Span.prototype.addLinks = function (links) {
        var _a;
        (_a = this.links).push.apply(_a, __spreadArray([], __read(links), false));
        return this;
    };
    Span.prototype.setStatus = function (status) {
        if (this._isSpanEnded()) return this;
        this.status = status;
        return this;
    };
    Span.prototype.updateName = function (name) {
        if (this._isSpanEnded()) return this;
        this.name = name;
        return this;
    };
    Span.prototype.end = function (endTime) {
        if (this._isSpanEnded()) {
            _api.diag.error(this.name + " " + this._spanContext.traceId + "-" + this._spanContext.spanId + " - You can only call end() on a span once.");
            return;
        }
        this._ended = true;
        this.endTime = this._getTime(endTime);
        this._duration = (0, _core.hrTimeDuration)(this.startTime, this.endTime);
        if (this._duration[0] < 0) {
            _api.diag.warn('Inconsistent start and end time, startTime > endTime. Setting span duration to 0ms.', this.startTime, this.endTime);
            this.endTime = this.startTime.slice();
            this._duration = [0, 0];
        }
        if (this._droppedEventsCount > 0) {
            _api.diag.warn("Dropped " + this._droppedEventsCount + " events because eventCountLimit reached");
        }
        this._spanProcessor.onEnd(this);
    };
    Span.prototype._getTime = function (inp) {
        if (typeof inp === 'number' && inp < _core.otperformance.now()) {
            // must be a performance timestamp
            // apply correction and convert to hrtime
            return (0, _core.hrTime)(inp + this._performanceOffset);
        }
        if (typeof inp === 'number') {
            return (0, _core.millisToHrTime)(inp);
        }
        if (inp instanceof Date) {
            return (0, _core.millisToHrTime)(inp.getTime());
        }
        if ((0, _core.isTimeInputHrTime)(inp)) {
            return inp;
        }
        if (this._startTimeProvided) {
            // if user provided a time for the start manually
            // we can't use duration to calculate event/end times
            return (0, _core.millisToHrTime)(Date.now());
        }
        var msDuration = _core.otperformance.now() - this._performanceStartTime;
        return (0, _core.addHrTimes)(this.startTime, (0, _core.millisToHrTime)(msDuration));
    };
    Span.prototype.isRecording = function () {
        return this._ended === false;
    };
    Span.prototype.recordException = function (exception, time) {
        var attributes = {};
        if (typeof exception === 'string') {
            attributes[_semanticConventions.SEMATTRS_EXCEPTION_MESSAGE] = exception;
        } else if (exception) {
            if (exception.code) {
                attributes[_semanticConventions.SEMATTRS_EXCEPTION_TYPE] = exception.code.toString();
            } else if (exception.name) {
                attributes[_semanticConventions.SEMATTRS_EXCEPTION_TYPE] = exception.name;
            }
            if (exception.message) {
                attributes[_semanticConventions.SEMATTRS_EXCEPTION_MESSAGE] = exception.message;
            }
            if (exception.stack) {
                attributes[_semanticConventions.SEMATTRS_EXCEPTION_STACKTRACE] = exception.stack;
            }
        }
        // these are minimum requirements from spec
        if (attributes[_semanticConventions.SEMATTRS_EXCEPTION_TYPE] || attributes[_semanticConventions.SEMATTRS_EXCEPTION_MESSAGE]) {
            this.addEvent(_enums.ExceptionEventName, attributes, time);
        } else {
            _api.diag.warn("Failed to record an exception " + exception);
        }
    };
    Object.defineProperty(Span.prototype, "duration", {
        get: function get() {
            return this._duration;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Span.prototype, "ended", {
        get: function get() {
            return this._ended;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Span.prototype, "droppedAttributesCount", {
        get: function get() {
            return this._droppedAttributesCount;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Span.prototype, "droppedEventsCount", {
        get: function get() {
            return this._droppedEventsCount;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Span.prototype, "droppedLinksCount", {
        get: function get() {
            return this._droppedLinksCount;
        },
        enumerable: false,
        configurable: true
    });
    Span.prototype._isSpanEnded = function () {
        if (this._ended) {
            _api.diag.warn("Can not execute the operation on ended Span {traceId: " + this._spanContext.traceId + ", spanId: " + this._spanContext.spanId + "}");
        }
        return this._ended;
    };
    // Utility function to truncate given value within size
    // for value type of string, will truncate to given limit
    // for type of non-string, will return same value
    Span.prototype._truncateToLimitUtil = function (value, limit) {
        if (value.length <= limit) {
            return value;
        }
        return value.substr(0, limit);
    };
    /**
     * If the given attribute value is of type string and has more characters than given {@code attributeValueLengthLimit} then
     * return string with truncated to {@code attributeValueLengthLimit} characters
     *
     * If the given attribute value is array of strings then
     * return new array of strings with each element truncated to {@code attributeValueLengthLimit} characters
     *
     * Otherwise return same Attribute {@code value}
     *
     * @param value Attribute value
     * @returns truncated attribute value if required, otherwise same value
     */
    Span.prototype._truncateToSize = function (value) {
        var _this = this;
        var limit = this._attributeValueLengthLimit;
        // Check limit
        if (limit <= 0) {
            // Negative values are invalid, so do not truncate
            _api.diag.warn("Attribute value limit must be positive, got " + limit);
            return value;
        }
        // String
        if (typeof value === 'string') {
            return this._truncateToLimitUtil(value, limit);
        }
        // Array of strings
        if (Array.isArray(value)) {
            return value.map(function (val) {
                return typeof val === 'string' ? _this._truncateToLimitUtil(val, limit) : val;
            });
        }
        // Other types, no need to apply value length limit
        return value;
    };
    return Span;
}();
exports.Span = Span;
//# sourceMappingURL=Span.js.map