'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Span = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
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


var _api = require('@opentelemetry/api');

var _core = require('@opentelemetry/core');

var _semanticConventions = require('@opentelemetry/semantic-conventions');

var _enums = require('./enums');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * This class represents a span.
 */
var Span = exports.Span = function () {
    /**
     * Constructs a new Span instance.
     *
     * @deprecated calling Span constructor directly is not supported. Please use tracer.startSpan.
     * */
    function Span(parentTracer, context, spanName, spanContext, kind, parentSpanId) {
        var links = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : [];
        var startTime = arguments[7];
        var _deprecatedClock = arguments[8];
        var // keeping this argument even though it is unused to ensure backwards compatibility
        attributes = arguments[9];

        _classCallCheck(this, Span);

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

    _createClass(Span, [{
        key: 'spanContext',
        value: function spanContext() {
            return this._spanContext;
        }
    }, {
        key: 'setAttribute',
        value: function setAttribute(key, value) {
            if (value == null || this._isSpanEnded()) return this;
            if (key.length === 0) {
                _api.diag.warn('Invalid attribute key: ' + key);
                return this;
            }
            if (!(0, _core.isAttributeValue)(value)) {
                _api.diag.warn('Invalid attribute value set for key: ' + key);
                return this;
            }
            if (Object.keys(this.attributes).length >= this._spanLimits.attributeCountLimit && !Object.prototype.hasOwnProperty.call(this.attributes, key)) {
                this._droppedAttributesCount++;
                return this;
            }
            this.attributes[key] = this._truncateToSize(value);
            return this;
        }
    }, {
        key: 'setAttributes',
        value: function setAttributes(attributes) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Object.entries(attributes)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _ref = _step.value;

                    var _ref2 = _slicedToArray(_ref, 2);

                    var k = _ref2[0];
                    var v = _ref2[1];

                    this.setAttribute(k, v);
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

            return this;
        }
        /**
         *
         * @param name Span Name
         * @param [attributesOrStartTime] Span attributes or start time
         *     if type is {@type TimeInput} and 3rd param is undefined
         * @param [timeStamp] Specified time stamp for the event
         */

    }, {
        key: 'addEvent',
        value: function addEvent(name, attributesOrStartTime, timeStamp) {
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
        }
    }, {
        key: 'addLink',
        value: function addLink(link) {
            this.links.push(link);
            return this;
        }
    }, {
        key: 'addLinks',
        value: function addLinks(links) {
            var _links;

            (_links = this.links).push.apply(_links, _toConsumableArray(links));
            return this;
        }
    }, {
        key: 'setStatus',
        value: function setStatus(status) {
            if (this._isSpanEnded()) return this;
            this.status = status;
            return this;
        }
    }, {
        key: 'updateName',
        value: function updateName(name) {
            if (this._isSpanEnded()) return this;
            this.name = name;
            return this;
        }
    }, {
        key: 'end',
        value: function end(endTime) {
            if (this._isSpanEnded()) {
                _api.diag.error(this.name + ' ' + this._spanContext.traceId + '-' + this._spanContext.spanId + ' - You can only call end() on a span once.');
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
                _api.diag.warn('Dropped ' + this._droppedEventsCount + ' events because eventCountLimit reached');
            }
            this._spanProcessor.onEnd(this);
        }
    }, {
        key: '_getTime',
        value: function _getTime(inp) {
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
        }
    }, {
        key: 'isRecording',
        value: function isRecording() {
            return this._ended === false;
        }
    }, {
        key: 'recordException',
        value: function recordException(exception, time) {
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
                _api.diag.warn('Failed to record an exception ' + exception);
            }
        }
    }, {
        key: '_isSpanEnded',
        value: function _isSpanEnded() {
            if (this._ended) {
                _api.diag.warn('Can not execute the operation on ended Span {traceId: ' + this._spanContext.traceId + ', spanId: ' + this._spanContext.spanId + '}');
            }
            return this._ended;
        }
        // Utility function to truncate given value within size
        // for value type of string, will truncate to given limit
        // for type of non-string, will return same value

    }, {
        key: '_truncateToLimitUtil',
        value: function _truncateToLimitUtil(value, limit) {
            if (value.length <= limit) {
                return value;
            }
            return value.substr(0, limit);
        }
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

    }, {
        key: '_truncateToSize',
        value: function _truncateToSize(value) {
            var _this = this;

            var limit = this._attributeValueLengthLimit;
            // Check limit
            if (limit <= 0) {
                // Negative values are invalid, so do not truncate
                _api.diag.warn('Attribute value limit must be positive, got ' + limit);
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
        }
    }, {
        key: 'duration',
        get: function get() {
            return this._duration;
        }
    }, {
        key: 'ended',
        get: function get() {
            return this._ended;
        }
    }, {
        key: 'droppedAttributesCount',
        get: function get() {
            return this._droppedAttributesCount;
        }
    }, {
        key: 'droppedEventsCount',
        get: function get() {
            return this._droppedEventsCount;
        }
    }, {
        key: 'droppedLinksCount',
        get: function get() {
            return this._droppedLinksCount;
        }
    }]);

    return Span;
}();
//# sourceMappingURL=Span.js.map