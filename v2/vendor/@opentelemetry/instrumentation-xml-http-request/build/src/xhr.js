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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
exports.XMLHttpRequestInstrumentation = void 0;
var api = require("@opentelemetry/api");
var instrumentation_1 = require("@opentelemetry/instrumentation");
var core_1 = require("@opentelemetry/core");
var semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
var sdk_trace_web_1 = require("@opentelemetry/sdk-trace-web");
var EventNames_1 = require("./enums/EventNames");
var version_1 = require("./version");
var AttributeNames_1 = require("./enums/AttributeNames");
// how long to wait for observer to collect information about resources
// this is needed as event "load" is called before observer
// hard to say how long it should really wait, seems like 300ms is
// safe enough
var OBSERVER_WAIT_TIME_MS = 300;
/**
 * This class represents a XMLHttpRequest plugin for auto instrumentation
 */

var XMLHttpRequestInstrumentation = function (_instrumentation_1$In) {
    _inherits(XMLHttpRequestInstrumentation, _instrumentation_1$In);

    function XMLHttpRequestInstrumentation() {
        var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, XMLHttpRequestInstrumentation);

        var _this = _possibleConstructorReturn(this, (XMLHttpRequestInstrumentation.__proto__ || Object.getPrototypeOf(XMLHttpRequestInstrumentation)).call(this, '@opentelemetry/instrumentation-xml-http-request', version_1.VERSION, config));

        _this.component = 'xml-http-request';
        _this.version = version_1.VERSION;
        _this.moduleName = _this.component;
        _this._tasksCount = 0;
        _this._xhrMem = new WeakMap();
        _this._usedResources = new WeakSet();
        return _this;
    }

    _createClass(XMLHttpRequestInstrumentation, [{
        key: "init",
        value: function init() {}
        /**
         * Adds custom headers to XMLHttpRequest
         * @param xhr
         * @param spanUrl
         * @private
         */

    }, {
        key: "_addHeaders",
        value: function _addHeaders(xhr, spanUrl) {
            var url = (0, sdk_trace_web_1.parseUrl)(spanUrl).href;
            if (!(0, sdk_trace_web_1.shouldPropagateTraceHeaders)(url, this.getConfig().propagateTraceHeaderCorsUrls)) {
                var _headers = {};
                api.propagation.inject(api.context.active(), _headers);
                if (Object.keys(_headers).length > 0) {
                    this._diag.debug('headers inject skipped due to CORS policy');
                }
                return;
            }
            var headers = {};
            api.propagation.inject(api.context.active(), headers);
            Object.keys(headers).forEach(function (key) {
                xhr.setRequestHeader(key, String(headers[key]));
            });
        }
        /**
         * Add cors pre flight child span
         * @param span
         * @param corsPreFlightRequest
         * @private
         */

    }, {
        key: "_addChildSpan",
        value: function _addChildSpan(span, corsPreFlightRequest) {
            var _this2 = this;

            api.context.with(api.trace.setSpan(api.context.active(), span), function () {
                var childSpan = _this2.tracer.startSpan('CORS Preflight', {
                    startTime: corsPreFlightRequest[sdk_trace_web_1.PerformanceTimingNames.FETCH_START]
                });
                if (!_this2.getConfig().ignoreNetworkEvents) {
                    (0, sdk_trace_web_1.addSpanNetworkEvents)(childSpan, corsPreFlightRequest);
                }
                childSpan.end(corsPreFlightRequest[sdk_trace_web_1.PerformanceTimingNames.RESPONSE_END]);
            });
        }
        /**
         * Add attributes when span is going to end
         * @param span
         * @param xhr
         * @param spanUrl
         * @private
         */

    }, {
        key: "_addFinalSpanAttributes",
        value: function _addFinalSpanAttributes(span, xhrMem, spanUrl) {
            if (typeof spanUrl === 'string') {
                var parsedUrl = (0, sdk_trace_web_1.parseUrl)(spanUrl);
                if (xhrMem.status !== undefined) {
                    span.setAttribute(semantic_conventions_1.SEMATTRS_HTTP_STATUS_CODE, xhrMem.status);
                }
                if (xhrMem.statusText !== undefined) {
                    span.setAttribute(AttributeNames_1.AttributeNames.HTTP_STATUS_TEXT, xhrMem.statusText);
                }
                span.setAttribute(semantic_conventions_1.SEMATTRS_HTTP_HOST, parsedUrl.host);
                span.setAttribute(semantic_conventions_1.SEMATTRS_HTTP_SCHEME, parsedUrl.protocol.replace(':', ''));
                // @TODO do we want to collect this or it will be collected earlier once only or
                //    maybe when parent span is not available ?
                span.setAttribute(semantic_conventions_1.SEMATTRS_HTTP_USER_AGENT, navigator.userAgent);
            }
        }
    }, {
        key: "_applyAttributesAfterXHR",
        value: function _applyAttributesAfterXHR(span, xhr) {
            var _this3 = this;

            var applyCustomAttributesOnSpan = this.getConfig().applyCustomAttributesOnSpan;
            if (typeof applyCustomAttributesOnSpan === 'function') {
                (0, instrumentation_1.safeExecuteInTheMiddle)(function () {
                    return applyCustomAttributesOnSpan(span, xhr);
                }, function (error) {
                    if (!error) {
                        return;
                    }
                    _this3._diag.error('applyCustomAttributesOnSpan', error);
                }, true);
            }
        }
        /**
         * will collect information about all resources created
         * between "send" and "end" with additional waiting for main resource
         * @param xhr
         * @param spanUrl
         * @private
         */

    }, {
        key: "_addResourceObserver",
        value: function _addResourceObserver(xhr, spanUrl) {
            var xhrMem = this._xhrMem.get(xhr);
            if (!xhrMem || typeof PerformanceObserver !== 'function' || typeof PerformanceResourceTiming !== 'function') {
                return;
            }
            xhrMem.createdResources = {
                observer: new PerformanceObserver(function (list) {
                    var entries = list.getEntries();
                    var parsedUrl = (0, sdk_trace_web_1.parseUrl)(spanUrl);
                    entries.forEach(function (entry) {
                        if (entry.initiatorType === 'xmlhttprequest' && entry.name === parsedUrl.href) {
                            if (xhrMem.createdResources) {
                                xhrMem.createdResources.entries.push(entry);
                            }
                        }
                    });
                }),
                entries: []
            };
            xhrMem.createdResources.observer.observe({
                entryTypes: ['resource']
            });
        }
        /**
         * Clears the resource timings and all resources assigned with spans
         *     when {@link XMLHttpRequestInstrumentationConfig.clearTimingResources} is
         *     set to true (default false)
         * @private
         */

    }, {
        key: "_clearResources",
        value: function _clearResources() {
            if (this._tasksCount === 0 && this.getConfig().clearTimingResources) {
                core_1.otperformance.clearResourceTimings();
                this._xhrMem = new WeakMap();
                this._usedResources = new WeakSet();
            }
        }
        /**
         * Finds appropriate resource and add network events to the span
         * @param span
         */

    }, {
        key: "_findResourceAndAddNetworkEvents",
        value: function _findResourceAndAddNetworkEvents(xhrMem, span, spanUrl, startTime, endTime) {
            if (!spanUrl || !startTime || !endTime || !xhrMem.createdResources) {
                return;
            }
            var resources = xhrMem.createdResources.entries;
            if (!resources || !resources.length) {
                // fallback - either Observer is not available or it took longer
                // then OBSERVER_WAIT_TIME_MS and observer didn't collect enough
                // information
                // ts thinks this is the perf_hooks module, but it is the browser performance api
                resources = core_1.otperformance.getEntriesByType('resource');
            }
            var resource = (0, sdk_trace_web_1.getResource)((0, sdk_trace_web_1.parseUrl)(spanUrl).href, startTime, endTime, resources, this._usedResources);
            if (resource.mainRequest) {
                var mainRequest = resource.mainRequest;
                this._markResourceAsUsed(mainRequest);
                var corsPreFlightRequest = resource.corsPreFlightRequest;
                if (corsPreFlightRequest) {
                    this._addChildSpan(span, corsPreFlightRequest);
                    this._markResourceAsUsed(corsPreFlightRequest);
                }
                if (!this.getConfig().ignoreNetworkEvents) {
                    (0, sdk_trace_web_1.addSpanNetworkEvents)(span, mainRequest);
                }
            }
        }
        /**
         * Removes the previous information about span.
         * This might happened when the same xhr is used again.
         * @param xhr
         * @private
         */

    }, {
        key: "_cleanPreviousSpanInformation",
        value: function _cleanPreviousSpanInformation(xhr) {
            var xhrMem = this._xhrMem.get(xhr);
            if (xhrMem) {
                var callbackToRemoveEvents = xhrMem.callbackToRemoveEvents;
                if (callbackToRemoveEvents) {
                    callbackToRemoveEvents();
                }
                this._xhrMem.delete(xhr);
            }
        }
        /**
         * Creates a new span when method "open" is called
         * @param xhr
         * @param url
         * @param method
         * @private
         */

    }, {
        key: "_createSpan",
        value: function _createSpan(xhr, url, method) {
            var _attributes;

            if ((0, core_1.isUrlIgnored)(url, this.getConfig().ignoreUrls)) {
                this._diag.debug('ignoring span as url matches ignored url');
                return;
            }
            var spanName = method.toUpperCase();
            var currentSpan = this.tracer.startSpan(spanName, {
                kind: api.SpanKind.CLIENT,
                attributes: (_attributes = {}, _defineProperty(_attributes, semantic_conventions_1.SEMATTRS_HTTP_METHOD, method), _defineProperty(_attributes, semantic_conventions_1.SEMATTRS_HTTP_URL, (0, sdk_trace_web_1.parseUrl)(url).toString()), _attributes)
            });
            currentSpan.addEvent(EventNames_1.EventNames.METHOD_OPEN);
            this._cleanPreviousSpanInformation(xhr);
            this._xhrMem.set(xhr, {
                span: currentSpan,
                spanUrl: url
            });
            return currentSpan;
        }
        /**
         * Marks certain [resource]{@link PerformanceResourceTiming} when information
         * from this is used to add events to span.
         * This is done to avoid reusing the same resource again for next span
         * @param resource
         * @private
         */

    }, {
        key: "_markResourceAsUsed",
        value: function _markResourceAsUsed(resource) {
            this._usedResources.add(resource);
        }
        /**
         * Patches the method open
         * @private
         */

    }, {
        key: "_patchOpen",
        value: function _patchOpen() {
            var _this4 = this;

            return function (original) {
                var plugin = _this4;
                return function patchOpen() {
                    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                        args[_key] = arguments[_key];
                    }

                    var method = args[0];
                    var url = args[1];
                    plugin._createSpan(this, url, method);
                    return original.apply(this, args);
                };
            };
        }
        /**
         * Patches the method send
         * @private
         */

    }, {
        key: "_patchSend",
        value: function _patchSend() {
            var plugin = this;
            function endSpanTimeout(eventName, xhrMem, performanceEndTime, endTime) {
                var callbackToRemoveEvents = xhrMem.callbackToRemoveEvents;
                if (typeof callbackToRemoveEvents === 'function') {
                    callbackToRemoveEvents();
                }
                var span = xhrMem.span,
                    spanUrl = xhrMem.spanUrl,
                    sendStartTime = xhrMem.sendStartTime;

                if (span) {
                    plugin._findResourceAndAddNetworkEvents(xhrMem, span, spanUrl, sendStartTime, performanceEndTime);
                    span.addEvent(eventName, endTime);
                    plugin._addFinalSpanAttributes(span, xhrMem, spanUrl);
                    span.end(endTime);
                    plugin._tasksCount--;
                }
                plugin._clearResources();
            }
            function endSpan(eventName, xhr) {
                var xhrMem = plugin._xhrMem.get(xhr);
                if (!xhrMem) {
                    return;
                }
                xhrMem.status = xhr.status;
                xhrMem.statusText = xhr.statusText;
                plugin._xhrMem.delete(xhr);
                if (xhrMem.span) {
                    plugin._applyAttributesAfterXHR(xhrMem.span, xhr);
                }
                var performanceEndTime = (0, core_1.hrTime)();
                var endTime = Date.now();
                // the timeout is needed as observer doesn't have yet information
                // when event "load" is called. Also the time may differ depends on
                // browser and speed of computer
                setTimeout(function () {
                    endSpanTimeout(eventName, xhrMem, performanceEndTime, endTime);
                }, OBSERVER_WAIT_TIME_MS);
            }
            function onError() {
                endSpan(EventNames_1.EventNames.EVENT_ERROR, this);
            }
            function onAbort() {
                endSpan(EventNames_1.EventNames.EVENT_ABORT, this);
            }
            function onTimeout() {
                endSpan(EventNames_1.EventNames.EVENT_TIMEOUT, this);
            }
            function onLoad() {
                if (this.status < 299) {
                    endSpan(EventNames_1.EventNames.EVENT_LOAD, this);
                } else {
                    endSpan(EventNames_1.EventNames.EVENT_ERROR, this);
                }
            }
            function unregister(xhr) {
                xhr.removeEventListener('abort', onAbort);
                xhr.removeEventListener('error', onError);
                xhr.removeEventListener('load', onLoad);
                xhr.removeEventListener('timeout', onTimeout);
                var xhrMem = plugin._xhrMem.get(xhr);
                if (xhrMem) {
                    xhrMem.callbackToRemoveEvents = undefined;
                }
            }
            return function (original) {
                return function patchSend() {
                    var _this5 = this;

                    var xhrMem = plugin._xhrMem.get(this);

                    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                        args[_key2] = arguments[_key2];
                    }

                    if (!xhrMem) {
                        return original.apply(this, args);
                    }
                    var currentSpan = xhrMem.span;
                    var spanUrl = xhrMem.spanUrl;
                    if (currentSpan && spanUrl) {
                        api.context.with(api.trace.setSpan(api.context.active(), currentSpan), function () {
                            plugin._tasksCount++;
                            xhrMem.sendStartTime = (0, core_1.hrTime)();
                            currentSpan.addEvent(EventNames_1.EventNames.METHOD_SEND);
                            _this5.addEventListener('abort', onAbort);
                            _this5.addEventListener('error', onError);
                            _this5.addEventListener('load', onLoad);
                            _this5.addEventListener('timeout', onTimeout);
                            xhrMem.callbackToRemoveEvents = function () {
                                unregister(_this5);
                                if (xhrMem.createdResources) {
                                    xhrMem.createdResources.observer.disconnect();
                                }
                            };
                            plugin._addHeaders(_this5, spanUrl);
                            plugin._addResourceObserver(_this5, spanUrl);
                        });
                    }
                    return original.apply(this, args);
                };
            };
        }
        /**
         * implements enable function
         */

    }, {
        key: "enable",
        value: function enable() {
            this._diag.debug('applying patch to', this.moduleName, this.version);
            if ((0, instrumentation_1.isWrapped)(XMLHttpRequest.prototype.open)) {
                this._unwrap(XMLHttpRequest.prototype, 'open');
                this._diag.debug('removing previous patch from method open');
            }
            if ((0, instrumentation_1.isWrapped)(XMLHttpRequest.prototype.send)) {
                this._unwrap(XMLHttpRequest.prototype, 'send');
                this._diag.debug('removing previous patch from method send');
            }
            this._wrap(XMLHttpRequest.prototype, 'open', this._patchOpen());
            this._wrap(XMLHttpRequest.prototype, 'send', this._patchSend());
        }
        /**
         * implements disable function
         */

    }, {
        key: "disable",
        value: function disable() {
            this._diag.debug('removing patch from', this.moduleName, this.version);
            this._unwrap(XMLHttpRequest.prototype, 'open');
            this._unwrap(XMLHttpRequest.prototype, 'send');
            this._tasksCount = 0;
            this._xhrMem = new WeakMap();
            this._usedResources = new WeakSet();
        }
    }]);

    return XMLHttpRequestInstrumentation;
}(instrumentation_1.InstrumentationBase);

exports.XMLHttpRequestInstrumentation = XMLHttpRequestInstrumentation;
//# sourceMappingURL=xhr.js.map