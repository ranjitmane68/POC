"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.XMLHttpRequestInstrumentation = undefined;

var _api = require("@opentelemetry/api");

var api = _interopRequireWildcard(_api);

var _instrumentation = require("@opentelemetry/instrumentation");

var _core = require("@opentelemetry/core");

var _semanticConventions = require("@opentelemetry/semantic-conventions");

var _sdkTraceWeb = require("@opentelemetry/sdk-trace-web");

var _EventNames = require("./enums/EventNames");

var _version = require("./version");

var _AttributeNames = require("./enums/AttributeNames");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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

// how long to wait for observer to collect information about resources
// this is needed as event "load" is called before observer
// hard to say how long it should really wait, seems like 300ms is
// safe enough
var OBSERVER_WAIT_TIME_MS = 300;
/**
 * This class represents a XMLHttpRequest plugin for auto instrumentation
 */
var XMLHttpRequestInstrumentation = /** @class */function (_super) {
    __extends(XMLHttpRequestInstrumentation, _super);
    function XMLHttpRequestInstrumentation(config) {
        if (config === void 0) {
            config = {};
        }
        var _this = _super.call(this, '@opentelemetry/instrumentation-xml-http-request', _version.VERSION, config) || this;
        _this.component = 'xml-http-request';
        _this.version = _version.VERSION;
        _this.moduleName = _this.component;
        _this._tasksCount = 0;
        _this._xhrMem = new WeakMap();
        _this._usedResources = new WeakSet();
        return _this;
    }
    XMLHttpRequestInstrumentation.prototype.init = function () {};
    /**
     * Adds custom headers to XMLHttpRequest
     * @param xhr
     * @param spanUrl
     * @private
     */
    XMLHttpRequestInstrumentation.prototype._addHeaders = function (xhr, spanUrl) {
        var url = (0, _sdkTraceWeb.parseUrl)(spanUrl).href;
        if (!(0, _sdkTraceWeb.shouldPropagateTraceHeaders)(url, this.getConfig().propagateTraceHeaderCorsUrls)) {
            var headers_1 = {};
            api.propagation.inject(api.context.active(), headers_1);
            if (Object.keys(headers_1).length > 0) {
                this._diag.debug('headers inject skipped due to CORS policy');
            }
            return;
        }
        var headers = {};
        api.propagation.inject(api.context.active(), headers);
        Object.keys(headers).forEach(function (key) {
            xhr.setRequestHeader(key, String(headers[key]));
        });
    };
    /**
     * Add cors pre flight child span
     * @param span
     * @param corsPreFlightRequest
     * @private
     */
    XMLHttpRequestInstrumentation.prototype._addChildSpan = function (span, corsPreFlightRequest) {
        var _this = this;
        api.context.with(api.trace.setSpan(api.context.active(), span), function () {
            var childSpan = _this.tracer.startSpan('CORS Preflight', {
                startTime: corsPreFlightRequest[_sdkTraceWeb.PerformanceTimingNames.FETCH_START]
            });
            if (!_this.getConfig().ignoreNetworkEvents) {
                (0, _sdkTraceWeb.addSpanNetworkEvents)(childSpan, corsPreFlightRequest);
            }
            childSpan.end(corsPreFlightRequest[_sdkTraceWeb.PerformanceTimingNames.RESPONSE_END]);
        });
    };
    /**
     * Add attributes when span is going to end
     * @param span
     * @param xhr
     * @param spanUrl
     * @private
     */
    XMLHttpRequestInstrumentation.prototype._addFinalSpanAttributes = function (span, xhrMem, spanUrl) {
        if (typeof spanUrl === 'string') {
            var parsedUrl = (0, _sdkTraceWeb.parseUrl)(spanUrl);
            if (xhrMem.status !== undefined) {
                span.setAttribute(_semanticConventions.SEMATTRS_HTTP_STATUS_CODE, xhrMem.status);
            }
            if (xhrMem.statusText !== undefined) {
                span.setAttribute(_AttributeNames.AttributeNames.HTTP_STATUS_TEXT, xhrMem.statusText);
            }
            span.setAttribute(_semanticConventions.SEMATTRS_HTTP_HOST, parsedUrl.host);
            span.setAttribute(_semanticConventions.SEMATTRS_HTTP_SCHEME, parsedUrl.protocol.replace(':', ''));
            // @TODO do we want to collect this or it will be collected earlier once only or
            //    maybe when parent span is not available ?
            span.setAttribute(_semanticConventions.SEMATTRS_HTTP_USER_AGENT, navigator.userAgent);
        }
    };
    XMLHttpRequestInstrumentation.prototype._applyAttributesAfterXHR = function (span, xhr) {
        var _this = this;
        var applyCustomAttributesOnSpan = this.getConfig().applyCustomAttributesOnSpan;
        if (typeof applyCustomAttributesOnSpan === 'function') {
            (0, _instrumentation.safeExecuteInTheMiddle)(function () {
                return applyCustomAttributesOnSpan(span, xhr);
            }, function (error) {
                if (!error) {
                    return;
                }
                _this._diag.error('applyCustomAttributesOnSpan', error);
            }, true);
        }
    };
    /**
     * will collect information about all resources created
     * between "send" and "end" with additional waiting for main resource
     * @param xhr
     * @param spanUrl
     * @private
     */
    XMLHttpRequestInstrumentation.prototype._addResourceObserver = function (xhr, spanUrl) {
        var xhrMem = this._xhrMem.get(xhr);
        if (!xhrMem || typeof PerformanceObserver !== 'function' || typeof PerformanceResourceTiming !== 'function') {
            return;
        }
        xhrMem.createdResources = {
            observer: new PerformanceObserver(function (list) {
                var entries = list.getEntries();
                var parsedUrl = (0, _sdkTraceWeb.parseUrl)(spanUrl);
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
    };
    /**
     * Clears the resource timings and all resources assigned with spans
     *     when {@link XMLHttpRequestInstrumentationConfig.clearTimingResources} is
     *     set to true (default false)
     * @private
     */
    XMLHttpRequestInstrumentation.prototype._clearResources = function () {
        if (this._tasksCount === 0 && this.getConfig().clearTimingResources) {
            _core.otperformance.clearResourceTimings();
            this._xhrMem = new WeakMap();
            this._usedResources = new WeakSet();
        }
    };
    /**
     * Finds appropriate resource and add network events to the span
     * @param span
     */
    XMLHttpRequestInstrumentation.prototype._findResourceAndAddNetworkEvents = function (xhrMem, span, spanUrl, startTime, endTime) {
        if (!spanUrl || !startTime || !endTime || !xhrMem.createdResources) {
            return;
        }
        var resources = xhrMem.createdResources.entries;
        if (!resources || !resources.length) {
            // fallback - either Observer is not available or it took longer
            // then OBSERVER_WAIT_TIME_MS and observer didn't collect enough
            // information
            // ts thinks this is the perf_hooks module, but it is the browser performance api
            resources = _core.otperformance.getEntriesByType('resource');
        }
        var resource = (0, _sdkTraceWeb.getResource)((0, _sdkTraceWeb.parseUrl)(spanUrl).href, startTime, endTime, resources, this._usedResources);
        if (resource.mainRequest) {
            var mainRequest = resource.mainRequest;
            this._markResourceAsUsed(mainRequest);
            var corsPreFlightRequest = resource.corsPreFlightRequest;
            if (corsPreFlightRequest) {
                this._addChildSpan(span, corsPreFlightRequest);
                this._markResourceAsUsed(corsPreFlightRequest);
            }
            if (!this.getConfig().ignoreNetworkEvents) {
                (0, _sdkTraceWeb.addSpanNetworkEvents)(span, mainRequest);
            }
        }
    };
    /**
     * Removes the previous information about span.
     * This might happened when the same xhr is used again.
     * @param xhr
     * @private
     */
    XMLHttpRequestInstrumentation.prototype._cleanPreviousSpanInformation = function (xhr) {
        var xhrMem = this._xhrMem.get(xhr);
        if (xhrMem) {
            var callbackToRemoveEvents = xhrMem.callbackToRemoveEvents;
            if (callbackToRemoveEvents) {
                callbackToRemoveEvents();
            }
            this._xhrMem.delete(xhr);
        }
    };
    /**
     * Creates a new span when method "open" is called
     * @param xhr
     * @param url
     * @param method
     * @private
     */
    XMLHttpRequestInstrumentation.prototype._createSpan = function (xhr, url, method) {
        var _a;
        if ((0, _core.isUrlIgnored)(url, this.getConfig().ignoreUrls)) {
            this._diag.debug('ignoring span as url matches ignored url');
            return;
        }
        var spanName = method.toUpperCase();
        var currentSpan = this.tracer.startSpan(spanName, {
            kind: api.SpanKind.CLIENT,
            attributes: (_a = {}, _a[_semanticConventions.SEMATTRS_HTTP_METHOD] = method, _a[_semanticConventions.SEMATTRS_HTTP_URL] = (0, _sdkTraceWeb.parseUrl)(url).toString(), _a)
        });
        currentSpan.addEvent(_EventNames.EventNames.METHOD_OPEN);
        this._cleanPreviousSpanInformation(xhr);
        this._xhrMem.set(xhr, {
            span: currentSpan,
            spanUrl: url
        });
        return currentSpan;
    };
    /**
     * Marks certain [resource]{@link PerformanceResourceTiming} when information
     * from this is used to add events to span.
     * This is done to avoid reusing the same resource again for next span
     * @param resource
     * @private
     */
    XMLHttpRequestInstrumentation.prototype._markResourceAsUsed = function (resource) {
        this._usedResources.add(resource);
    };
    /**
     * Patches the method open
     * @private
     */
    XMLHttpRequestInstrumentation.prototype._patchOpen = function () {
        var _this = this;
        return function (original) {
            var plugin = _this;
            return function patchOpen() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var method = args[0];
                var url = args[1];
                plugin._createSpan(this, url, method);
                return original.apply(this, args);
            };
        };
    };
    /**
     * Patches the method send
     * @private
     */
    XMLHttpRequestInstrumentation.prototype._patchSend = function () {
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
            var performanceEndTime = (0, _core.hrTime)();
            var endTime = Date.now();
            // the timeout is needed as observer doesn't have yet information
            // when event "load" is called. Also the time may differ depends on
            // browser and speed of computer
            setTimeout(function () {
                endSpanTimeout(eventName, xhrMem, performanceEndTime, endTime);
            }, OBSERVER_WAIT_TIME_MS);
        }
        function onError() {
            endSpan(_EventNames.EventNames.EVENT_ERROR, this);
        }
        function onAbort() {
            endSpan(_EventNames.EventNames.EVENT_ABORT, this);
        }
        function onTimeout() {
            endSpan(_EventNames.EventNames.EVENT_TIMEOUT, this);
        }
        function onLoad() {
            if (this.status < 299) {
                endSpan(_EventNames.EventNames.EVENT_LOAD, this);
            } else {
                endSpan(_EventNames.EventNames.EVENT_ERROR, this);
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
                var _this = this;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var xhrMem = plugin._xhrMem.get(this);
                if (!xhrMem) {
                    return original.apply(this, args);
                }
                var currentSpan = xhrMem.span;
                var spanUrl = xhrMem.spanUrl;
                if (currentSpan && spanUrl) {
                    api.context.with(api.trace.setSpan(api.context.active(), currentSpan), function () {
                        plugin._tasksCount++;
                        xhrMem.sendStartTime = (0, _core.hrTime)();
                        currentSpan.addEvent(_EventNames.EventNames.METHOD_SEND);
                        _this.addEventListener('abort', onAbort);
                        _this.addEventListener('error', onError);
                        _this.addEventListener('load', onLoad);
                        _this.addEventListener('timeout', onTimeout);
                        xhrMem.callbackToRemoveEvents = function () {
                            unregister(_this);
                            if (xhrMem.createdResources) {
                                xhrMem.createdResources.observer.disconnect();
                            }
                        };
                        plugin._addHeaders(_this, spanUrl);
                        plugin._addResourceObserver(_this, spanUrl);
                    });
                }
                return original.apply(this, args);
            };
        };
    };
    /**
     * implements enable function
     */
    XMLHttpRequestInstrumentation.prototype.enable = function () {
        this._diag.debug('applying patch to', this.moduleName, this.version);
        if ((0, _instrumentation.isWrapped)(XMLHttpRequest.prototype.open)) {
            this._unwrap(XMLHttpRequest.prototype, 'open');
            this._diag.debug('removing previous patch from method open');
        }
        if ((0, _instrumentation.isWrapped)(XMLHttpRequest.prototype.send)) {
            this._unwrap(XMLHttpRequest.prototype, 'send');
            this._diag.debug('removing previous patch from method send');
        }
        this._wrap(XMLHttpRequest.prototype, 'open', this._patchOpen());
        this._wrap(XMLHttpRequest.prototype, 'send', this._patchSend());
    };
    /**
     * implements disable function
     */
    XMLHttpRequestInstrumentation.prototype.disable = function () {
        this._diag.debug('removing patch from', this.moduleName, this.version);
        this._unwrap(XMLHttpRequest.prototype, 'open');
        this._unwrap(XMLHttpRequest.prototype, 'send');
        this._tasksCount = 0;
        this._xhrMem = new WeakMap();
        this._usedResources = new WeakSet();
    };
    return XMLHttpRequestInstrumentation;
}(_instrumentation.InstrumentationBase);
exports.XMLHttpRequestInstrumentation = XMLHttpRequestInstrumentation;
//# sourceMappingURL=xhr.js.map