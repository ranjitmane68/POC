"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DocumentLoadInstrumentation = undefined;

var _api = require("@opentelemetry/api");

var _core = require("@opentelemetry/core");

var _sdkTraceWeb = require("@opentelemetry/sdk-trace-web");

var _instrumentation = require("@opentelemetry/instrumentation");

var _AttributeNames = require("./enums/AttributeNames");

var _version = require("./version");

var _semanticConventions = require("@opentelemetry/semantic-conventions");

var _utils = require("./utils");

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
 * This class represents a document load plugin
 */
var DocumentLoadInstrumentation = /** @class */function (_super) {
    __extends(DocumentLoadInstrumentation, _super);
    /**
     *
     * @param config
     */
    function DocumentLoadInstrumentation(config) {
        if (config === void 0) {
            config = {};
        }
        var _this = _super.call(this, _version.PACKAGE_NAME, _version.PACKAGE_VERSION, config) || this;
        _this.component = 'document-load';
        _this.version = '1';
        _this.moduleName = _this.component;
        return _this;
    }
    DocumentLoadInstrumentation.prototype.init = function () {};
    /**
     * callback to be executed when page is loaded
     */
    DocumentLoadInstrumentation.prototype._onDocumentLoaded = function () {
        var _this = this;
        // Timeout is needed as load event doesn't have yet the performance metrics for loadEnd.
        // Support for event "loadend" is very limited and cannot be used
        window.setTimeout(function () {
            _this._collectPerformance();
        });
    };
    /**
     * Adds spans for all resources
     * @param rootSpan
     */
    DocumentLoadInstrumentation.prototype._addResourcesSpans = function (rootSpan) {
        var _this = this;
        var _a, _b;
        var resources = (_b = (_a = _core.otperformance).getEntriesByType) === null || _b === void 0 ? void 0 : _b.call(_a, 'resource');
        if (resources) {
            resources.forEach(function (resource) {
                _this._initResourceSpan(resource, rootSpan);
            });
        }
    };
    /**
     * Collects information about performance and creates appropriate spans
     */
    DocumentLoadInstrumentation.prototype._collectPerformance = function () {
        var _this = this;
        var metaElement = Array.from(document.getElementsByTagName('meta')).find(function (e) {
            return e.getAttribute('name') === _core.TRACE_PARENT_HEADER;
        });
        var entries = (0, _utils.getPerformanceNavigationEntries)();
        var traceparent = metaElement && metaElement.content || '';
        _api.context.with(_api.propagation.extract(_api.ROOT_CONTEXT, { traceparent: traceparent }), function () {
            var _a;
            var rootSpan = _this._startSpan(_AttributeNames.AttributeNames.DOCUMENT_LOAD, _sdkTraceWeb.PerformanceTimingNames.FETCH_START, entries);
            if (!rootSpan) {
                return;
            }
            _api.context.with(_api.trace.setSpan(_api.context.active(), rootSpan), function () {
                var fetchSpan = _this._startSpan(_AttributeNames.AttributeNames.DOCUMENT_FETCH, _sdkTraceWeb.PerformanceTimingNames.FETCH_START, entries);
                if (fetchSpan) {
                    fetchSpan.setAttribute(_semanticConventions.SEMATTRS_HTTP_URL, location.href);
                    _api.context.with(_api.trace.setSpan(_api.context.active(), fetchSpan), function () {
                        var _a;
                        if (!_this._getConfig().ignoreNetworkEvents) {
                            (0, _sdkTraceWeb.addSpanNetworkEvents)(fetchSpan, entries);
                        }
                        _this._addCustomAttributesOnSpan(fetchSpan, (_a = _this._getConfig().applyCustomAttributesOnSpan) === null || _a === void 0 ? void 0 : _a.documentFetch);
                        _this._endSpan(fetchSpan, _sdkTraceWeb.PerformanceTimingNames.RESPONSE_END, entries);
                    });
                }
            });
            rootSpan.setAttribute(_semanticConventions.SEMATTRS_HTTP_URL, location.href);
            rootSpan.setAttribute(_semanticConventions.SEMATTRS_HTTP_USER_AGENT, navigator.userAgent);
            _this._addResourcesSpans(rootSpan);
            if (!_this._getConfig().ignoreNetworkEvents) {
                (0, _sdkTraceWeb.addSpanNetworkEvent)(rootSpan, _sdkTraceWeb.PerformanceTimingNames.FETCH_START, entries);
                (0, _sdkTraceWeb.addSpanNetworkEvent)(rootSpan, _sdkTraceWeb.PerformanceTimingNames.UNLOAD_EVENT_START, entries);
                (0, _sdkTraceWeb.addSpanNetworkEvent)(rootSpan, _sdkTraceWeb.PerformanceTimingNames.UNLOAD_EVENT_END, entries);
                (0, _sdkTraceWeb.addSpanNetworkEvent)(rootSpan, _sdkTraceWeb.PerformanceTimingNames.DOM_INTERACTIVE, entries);
                (0, _sdkTraceWeb.addSpanNetworkEvent)(rootSpan, _sdkTraceWeb.PerformanceTimingNames.DOM_CONTENT_LOADED_EVENT_START, entries);
                (0, _sdkTraceWeb.addSpanNetworkEvent)(rootSpan, _sdkTraceWeb.PerformanceTimingNames.DOM_CONTENT_LOADED_EVENT_END, entries);
                (0, _sdkTraceWeb.addSpanNetworkEvent)(rootSpan, _sdkTraceWeb.PerformanceTimingNames.DOM_COMPLETE, entries);
                (0, _sdkTraceWeb.addSpanNetworkEvent)(rootSpan, _sdkTraceWeb.PerformanceTimingNames.LOAD_EVENT_START, entries);
                (0, _sdkTraceWeb.addSpanNetworkEvent)(rootSpan, _sdkTraceWeb.PerformanceTimingNames.LOAD_EVENT_END, entries);
            }
            if (!_this._getConfig().ignorePerformancePaintEvents) {
                (0, _utils.addSpanPerformancePaintEvents)(rootSpan);
            }
            _this._addCustomAttributesOnSpan(rootSpan, (_a = _this._getConfig().applyCustomAttributesOnSpan) === null || _a === void 0 ? void 0 : _a.documentLoad);
            _this._endSpan(rootSpan, _sdkTraceWeb.PerformanceTimingNames.LOAD_EVENT_END, entries);
        });
    };
    /**
     * Helper function for ending span
     * @param span
     * @param performanceName name of performance entry for time end
     * @param entries
     */
    DocumentLoadInstrumentation.prototype._endSpan = function (span, performanceName, entries) {
        // span can be undefined when entries are missing the certain performance - the span will not be created
        if (span) {
            if ((0, _sdkTraceWeb.hasKey)(entries, performanceName)) {
                span.end(entries[performanceName]);
            } else {
                // just end span
                span.end();
            }
        }
    };
    /**
     * Creates and ends a span with network information about resource added as timed events
     * @param resource
     * @param parentSpan
     */
    DocumentLoadInstrumentation.prototype._initResourceSpan = function (resource, parentSpan) {
        var _a;
        var span = this._startSpan(_AttributeNames.AttributeNames.RESOURCE_FETCH, _sdkTraceWeb.PerformanceTimingNames.FETCH_START, resource, parentSpan);
        if (span) {
            span.setAttribute(_semanticConventions.SEMATTRS_HTTP_URL, resource.name);
            if (!this._getConfig().ignoreNetworkEvents) {
                (0, _sdkTraceWeb.addSpanNetworkEvents)(span, resource);
            }
            this._addCustomAttributesOnResourceSpan(span, resource, (_a = this._getConfig().applyCustomAttributesOnSpan) === null || _a === void 0 ? void 0 : _a.resourceFetch);
            this._endSpan(span, _sdkTraceWeb.PerformanceTimingNames.RESPONSE_END, resource);
        }
    };
    /**
     * Helper function for starting a span
     * @param spanName name of span
     * @param performanceName name of performance entry for time start
     * @param entries
     * @param parentSpan
     */
    DocumentLoadInstrumentation.prototype._startSpan = function (spanName, performanceName, entries, parentSpan) {
        if ((0, _sdkTraceWeb.hasKey)(entries, performanceName) && typeof entries[performanceName] === 'number') {
            var span = this.tracer.startSpan(spanName, {
                startTime: entries[performanceName]
            }, parentSpan ? _api.trace.setSpan(_api.context.active(), parentSpan) : undefined);
            return span;
        }
        return undefined;
    };
    /**
     * executes callback {_onDocumentLoaded} when the page is loaded
     */
    DocumentLoadInstrumentation.prototype._waitForPageLoad = function () {
        if (window.document.readyState === 'complete') {
            this._onDocumentLoaded();
        } else {
            this._onDocumentLoaded = this._onDocumentLoaded.bind(this);
            window.addEventListener('load', this._onDocumentLoaded);
        }
    };
    DocumentLoadInstrumentation.prototype._getConfig = function () {
        return this._config;
    };
    /**
     * adds custom attributes to root span if configured
     */
    DocumentLoadInstrumentation.prototype._addCustomAttributesOnSpan = function (span, applyCustomAttributesOnSpan) {
        var _this = this;
        if (applyCustomAttributesOnSpan) {
            (0, _instrumentation.safeExecuteInTheMiddle)(function () {
                return applyCustomAttributesOnSpan(span);
            }, function (error) {
                if (!error) {
                    return;
                }
                _this._diag.error('addCustomAttributesOnSpan', error);
            }, true);
        }
    };
    /**
     * adds custom attributes to span if configured
     */
    DocumentLoadInstrumentation.prototype._addCustomAttributesOnResourceSpan = function (span, resource, applyCustomAttributesOnSpan) {
        var _this = this;
        if (applyCustomAttributesOnSpan) {
            (0, _instrumentation.safeExecuteInTheMiddle)(function () {
                return applyCustomAttributesOnSpan(span, resource);
            }, function (error) {
                if (!error) {
                    return;
                }
                _this._diag.error('addCustomAttributesOnResourceSpan', error);
            }, true);
        }
    };
    /**
     * implements enable function
     */
    DocumentLoadInstrumentation.prototype.enable = function () {
        // remove previously attached load to avoid adding the same event twice
        // in case of multiple enable calling.
        window.removeEventListener('load', this._onDocumentLoaded);
        this._waitForPageLoad();
    };
    /**
     * implements disable function
     */
    DocumentLoadInstrumentation.prototype.disable = function () {
        window.removeEventListener('load', this._onDocumentLoaded);
    };
    return DocumentLoadInstrumentation;
}(_instrumentation.InstrumentationBase);
exports.DocumentLoadInstrumentation = DocumentLoadInstrumentation;
//# sourceMappingURL=instrumentation.js.map