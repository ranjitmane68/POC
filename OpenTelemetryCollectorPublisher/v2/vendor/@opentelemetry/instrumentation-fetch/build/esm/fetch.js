"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FetchInstrumentation = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _api = require("@opentelemetry/api");

var api = _interopRequireWildcard(_api);

var _instrumentation = require("@opentelemetry/instrumentation");

var _core = require("@opentelemetry/core");

var core = _interopRequireWildcard(_core);

var _sdkTraceWeb = require("@opentelemetry/sdk-trace-web");

var web = _interopRequireWildcard(_sdkTraceWeb);

var _AttributeNames = require("./enums/AttributeNames");

var _semanticConventions = require("@opentelemetry/semantic-conventions");

var _version = require("./version");

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
var _a;

// how long to wait for observer to collect information about resources
// this is needed as event "load" is called before observer
// hard to say how long it should really wait, seems like 300ms is
// safe enough
var OBSERVER_WAIT_TIME_MS = 300;
var isNode = (typeof process === "undefined" ? "undefined" : _typeof(process)) === 'object' && ((_a = process.release) === null || _a === void 0 ? void 0 : _a.name) === 'node';
/**
 * This class represents a fetch plugin for auto instrumentation
 */
var FetchInstrumentation = /** @class */function (_super) {
    __extends(FetchInstrumentation, _super);
    function FetchInstrumentation(config) {
        if (config === void 0) {
            config = {};
        }
        var _this = _super.call(this, '@opentelemetry/instrumentation-fetch', _version.VERSION, config) || this;
        _this.component = 'fetch';
        _this.version = _version.VERSION;
        _this.moduleName = _this.component;
        _this._usedResources = new WeakSet();
        _this._tasksCount = 0;
        return _this;
    }
    FetchInstrumentation.prototype.init = function () {};
    /**
     * Add cors pre flight child span
     * @param span
     * @param corsPreFlightRequest
     */
    FetchInstrumentation.prototype._addChildSpan = function (span, corsPreFlightRequest) {
        var childSpan = this.tracer.startSpan('CORS Preflight', {
            startTime: corsPreFlightRequest[web.PerformanceTimingNames.FETCH_START]
        }, api.trace.setSpan(api.context.active(), span));
        if (!this.getConfig().ignoreNetworkEvents) {
            web.addSpanNetworkEvents(childSpan, corsPreFlightRequest);
        }
        childSpan.end(corsPreFlightRequest[web.PerformanceTimingNames.RESPONSE_END]);
    };
    /**
     * Adds more attributes to span just before ending it
     * @param span
     * @param response
     */
    FetchInstrumentation.prototype._addFinalSpanAttributes = function (span, response) {
        var parsedUrl = web.parseUrl(response.url);
        span.setAttribute(_semanticConventions.SEMATTRS_HTTP_STATUS_CODE, response.status);
        if (response.statusText != null) {
            span.setAttribute(_AttributeNames.AttributeNames.HTTP_STATUS_TEXT, response.statusText);
        }
        span.setAttribute(_semanticConventions.SEMATTRS_HTTP_HOST, parsedUrl.host);
        span.setAttribute(_semanticConventions.SEMATTRS_HTTP_SCHEME, parsedUrl.protocol.replace(':', ''));
        if (typeof navigator !== 'undefined') {
            span.setAttribute(_semanticConventions.SEMATTRS_HTTP_USER_AGENT, navigator.userAgent);
        }
    };
    /**
     * Add headers
     * @param options
     * @param spanUrl
     */
    FetchInstrumentation.prototype._addHeaders = function (options, spanUrl) {
        if (!web.shouldPropagateTraceHeaders(spanUrl, this.getConfig().propagateTraceHeaderCorsUrls)) {
            var headers = {};
            api.propagation.inject(api.context.active(), headers);
            if (Object.keys(headers).length > 0) {
                this._diag.debug('headers inject skipped due to CORS policy');
            }
            return;
        }
        if (options instanceof Request) {
            api.propagation.inject(api.context.active(), options.headers, {
                set: function set(h, k, v) {
                    return h.set(k, typeof v === 'string' ? v : String(v));
                }
            });
        } else if (options.headers instanceof Headers) {
            api.propagation.inject(api.context.active(), options.headers, {
                set: function set(h, k, v) {
                    return h.set(k, typeof v === 'string' ? v : String(v));
                }
            });
        } else if (options.headers instanceof Map) {
            api.propagation.inject(api.context.active(), options.headers, {
                set: function set(h, k, v) {
                    return h.set(k, typeof v === 'string' ? v : String(v));
                }
            });
        } else {
            var headers = {};
            api.propagation.inject(api.context.active(), headers);
            options.headers = Object.assign({}, headers, options.headers || {});
        }
    };
    /**
     * Clears the resource timings and all resources assigned with spans
     *     when {@link FetchPluginConfig.clearTimingResources} is
     *     set to true (default false)
     * @private
     */
    FetchInstrumentation.prototype._clearResources = function () {
        if (this._tasksCount === 0 && this.getConfig().clearTimingResources) {
            performance.clearResourceTimings();
            this._usedResources = new WeakSet();
        }
    };
    /**
     * Creates a new span
     * @param url
     * @param options
     */
    FetchInstrumentation.prototype._createSpan = function (url, options) {
        var _a;
        if (options === void 0) {
            options = {};
        }
        if (core.isUrlIgnored(url, this.getConfig().ignoreUrls)) {
            this._diag.debug('ignoring span as url matches ignored url');
            return;
        }
        var method = (options.method || 'GET').toUpperCase();
        var spanName = "HTTP " + method;
        return this.tracer.startSpan(spanName, {
            kind: api.SpanKind.CLIENT,
            attributes: (_a = {}, _a[_AttributeNames.AttributeNames.COMPONENT] = this.moduleName, _a[_semanticConventions.SEMATTRS_HTTP_METHOD] = method, _a[_semanticConventions.SEMATTRS_HTTP_URL] = url, _a)
        });
    };
    /**
     * Finds appropriate resource and add network events to the span
     * @param span
     * @param resourcesObserver
     * @param endTime
     */
    FetchInstrumentation.prototype._findResourceAndAddNetworkEvents = function (span, resourcesObserver, endTime) {
        var resources = resourcesObserver.entries;
        if (!resources.length) {
            if (!performance.getEntriesByType) {
                return;
            }
            // fallback - either Observer is not available or it took longer
            // then OBSERVER_WAIT_TIME_MS and observer didn't collect enough
            // information
            resources = performance.getEntriesByType('resource');
        }
        var resource = web.getResource(resourcesObserver.spanUrl, resourcesObserver.startTime, endTime, resources, this._usedResources, 'fetch');
        if (resource.mainRequest) {
            var mainRequest = resource.mainRequest;
            this._markResourceAsUsed(mainRequest);
            var corsPreFlightRequest = resource.corsPreFlightRequest;
            if (corsPreFlightRequest) {
                this._addChildSpan(span, corsPreFlightRequest);
                this._markResourceAsUsed(corsPreFlightRequest);
            }
            if (!this.getConfig().ignoreNetworkEvents) {
                web.addSpanNetworkEvents(span, mainRequest);
            }
        }
    };
    /**
     * Marks certain [resource]{@link PerformanceResourceTiming} when information
     * from this is used to add events to span.
     * This is done to avoid reusing the same resource again for next span
     * @param resource
     */
    FetchInstrumentation.prototype._markResourceAsUsed = function (resource) {
        this._usedResources.add(resource);
    };
    /**
     * Finish span, add attributes, network events etc.
     * @param span
     * @param spanData
     * @param response
     */
    FetchInstrumentation.prototype._endSpan = function (span, spanData, response) {
        var _this = this;
        var endTime = core.millisToHrTime(Date.now());
        var performanceEndTime = core.hrTime();
        this._addFinalSpanAttributes(span, response);
        setTimeout(function () {
            var _a;
            (_a = spanData.observer) === null || _a === void 0 ? void 0 : _a.disconnect();
            _this._findResourceAndAddNetworkEvents(span, spanData, performanceEndTime);
            _this._tasksCount--;
            _this._clearResources();
            span.end(endTime);
        }, OBSERVER_WAIT_TIME_MS);
    };
    /**
     * Patches the constructor of fetch
     */
    FetchInstrumentation.prototype._patchConstructor = function () {
        var _this = this;
        return function (original) {
            var plugin = _this;
            return function patchConstructor() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var self = this;
                var url = web.parseUrl(args[0] instanceof Request ? args[0].url : String(args[0])).href;
                var options = args[0] instanceof Request ? args[0] : args[1] || {};
                var createdSpan = plugin._createSpan(url, options);
                if (!createdSpan) {
                    return original.apply(this, args);
                }
                var spanData = plugin._prepareSpanData(url);
                function endSpanOnError(span, error) {
                    plugin._applyAttributesAfterFetch(span, options, error);
                    plugin._endSpan(span, spanData, {
                        status: error.status || 0,
                        statusText: error.message,
                        url: url
                    });
                }
                function endSpanOnSuccess(span, response) {
                    plugin._applyAttributesAfterFetch(span, options, response);
                    if (response.status >= 200 && response.status < 400) {
                        plugin._endSpan(span, spanData, response);
                    } else {
                        plugin._endSpan(span, spanData, {
                            status: response.status,
                            statusText: response.statusText,
                            url: url
                        });
                    }
                }
                function onSuccess(span, resolve, response) {
                    try {
                        var resClone = response.clone();
                        var resClone4Hook_1 = response.clone();
                        var body = resClone.body;
                        if (body) {
                            var reader_1 = body.getReader();
                            var read_1 = function read_1() {
                                reader_1.read().then(function (_a) {
                                    var done = _a.done;
                                    if (done) {
                                        endSpanOnSuccess(span, resClone4Hook_1);
                                    } else {
                                        read_1();
                                    }
                                }, function (error) {
                                    endSpanOnError(span, error);
                                });
                            };
                            read_1();
                        } else {
                            // some older browsers don't have .body implemented
                            endSpanOnSuccess(span, response);
                        }
                    } finally {
                        resolve(response);
                    }
                }
                function onError(span, reject, error) {
                    try {
                        endSpanOnError(span, error);
                    } finally {
                        reject(error);
                    }
                }
                return new Promise(function (resolve, reject) {
                    return api.context.with(api.trace.setSpan(api.context.active(), createdSpan), function () {
                        plugin._addHeaders(options, url);
                        plugin._tasksCount++;
                        // TypeScript complains about arrow function captured a this typed as globalThis
                        // ts(7041)
                        return original.apply(self, options instanceof Request ? [options] : [url, options]).then(onSuccess.bind(self, createdSpan, resolve), onError.bind(self, createdSpan, reject));
                    });
                });
            };
        };
    };
    FetchInstrumentation.prototype._applyAttributesAfterFetch = function (span, request, result) {
        var _this = this;
        var applyCustomAttributesOnSpan = this.getConfig().applyCustomAttributesOnSpan;
        if (applyCustomAttributesOnSpan) {
            (0, _instrumentation.safeExecuteInTheMiddle)(function () {
                return applyCustomAttributesOnSpan(span, request, result);
            }, function (error) {
                if (!error) {
                    return;
                }
                _this._diag.error('applyCustomAttributesOnSpan', error);
            }, true);
        }
    };
    /**
     * Prepares a span data - needed later for matching appropriate network
     *     resources
     * @param spanUrl
     */
    FetchInstrumentation.prototype._prepareSpanData = function (spanUrl) {
        var startTime = core.hrTime();
        var entries = [];
        if (typeof PerformanceObserver !== 'function') {
            return { entries: entries, startTime: startTime, spanUrl: spanUrl };
        }
        var observer = new PerformanceObserver(function (list) {
            var perfObsEntries = list.getEntries();
            perfObsEntries.forEach(function (entry) {
                if (entry.initiatorType === 'fetch' && entry.name === spanUrl) {
                    entries.push(entry);
                }
            });
        });
        observer.observe({
            entryTypes: ['resource']
        });
        return { entries: entries, observer: observer, startTime: startTime, spanUrl: spanUrl };
    };
    /**
     * implements enable function
     */
    FetchInstrumentation.prototype.enable = function () {
        if (isNode) {
            // Node.js v18+ *does* have a global `fetch()`, but this package does not
            // support instrumenting it.
            this._diag.warn("this instrumentation is intended for web usage only, it does not instrument Node.js's fetch()");
            return;
        }
        if ((0, _instrumentation.isWrapped)(fetch)) {
            this._unwrap(_core._globalThis, 'fetch');
            this._diag.debug('removing previous patch for constructor');
        }
        this._wrap(_core._globalThis, 'fetch', this._patchConstructor());
    };
    /**
     * implements unpatch function
     */
    FetchInstrumentation.prototype.disable = function () {
        if (isNode) {
            return;
        }
        this._unwrap(_core._globalThis, 'fetch');
        this._usedResources = new WeakSet();
    };
    return FetchInstrumentation;
}(_instrumentation.InstrumentationBase);
exports.FetchInstrumentation = FetchInstrumentation;
//# sourceMappingURL=fetch.js.map