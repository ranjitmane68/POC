'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DocumentLoadInstrumentation = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _api = require('@opentelemetry/api');

var _core = require('@opentelemetry/core');

var _sdkTraceWeb = require('@opentelemetry/sdk-trace-web');

var _instrumentation = require('@opentelemetry/instrumentation');

var _AttributeNames = require('./enums/AttributeNames');

var _version = require('./version');

var _semanticConventions = require('@opentelemetry/semantic-conventions');

var _utils = require('./utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
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


/**
 * This class represents a document load plugin
 */
var DocumentLoadInstrumentation = exports.DocumentLoadInstrumentation = function (_InstrumentationBase) {
    _inherits(DocumentLoadInstrumentation, _InstrumentationBase);

    /**
     *
     * @param config
     */
    function DocumentLoadInstrumentation() {
        var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, DocumentLoadInstrumentation);

        var _this = _possibleConstructorReturn(this, (DocumentLoadInstrumentation.__proto__ || Object.getPrototypeOf(DocumentLoadInstrumentation)).call(this, _version.PACKAGE_NAME, _version.PACKAGE_VERSION, config));

        _this.component = 'document-load';
        _this.version = '1';
        _this.moduleName = _this.component;
        return _this;
    }

    _createClass(DocumentLoadInstrumentation, [{
        key: 'init',
        value: function init() {}
        /**
         * callback to be executed when page is loaded
         */

    }, {
        key: '_onDocumentLoaded',
        value: function _onDocumentLoaded() {
            var _this2 = this;

            // Timeout is needed as load event doesn't have yet the performance metrics for loadEnd.
            // Support for event "loadend" is very limited and cannot be used
            window.setTimeout(function () {
                _this2._collectPerformance();
            });
        }
        /**
         * Adds spans for all resources
         * @param rootSpan
         */

    }, {
        key: '_addResourcesSpans',
        value: function _addResourcesSpans(rootSpan) {
            var _this3 = this;

            var _a, _b;
            var resources = (_b = (_a = _core.otperformance).getEntriesByType) === null || _b === void 0 ? void 0 : _b.call(_a, 'resource');
            if (resources) {
                resources.forEach(function (resource) {
                    _this3._initResourceSpan(resource, rootSpan);
                });
            }
        }
        /**
         * Collects information about performance and creates appropriate spans
         */

    }, {
        key: '_collectPerformance',
        value: function _collectPerformance() {
            var _this4 = this;

            var metaElement = Array.from(document.getElementsByTagName('meta')).find(function (e) {
                return e.getAttribute('name') === _core.TRACE_PARENT_HEADER;
            });
            var entries = (0, _utils.getPerformanceNavigationEntries)();
            var traceparent = metaElement && metaElement.content || '';
            _api.context.with(_api.propagation.extract(_api.ROOT_CONTEXT, { traceparent: traceparent }), function () {
                var _a;
                var rootSpan = _this4._startSpan(_AttributeNames.AttributeNames.DOCUMENT_LOAD, _sdkTraceWeb.PerformanceTimingNames.FETCH_START, entries);
                if (!rootSpan) {
                    return;
                }
                _api.context.with(_api.trace.setSpan(_api.context.active(), rootSpan), function () {
                    var fetchSpan = _this4._startSpan(_AttributeNames.AttributeNames.DOCUMENT_FETCH, _sdkTraceWeb.PerformanceTimingNames.FETCH_START, entries);
                    if (fetchSpan) {
                        fetchSpan.setAttribute(_semanticConventions.SEMATTRS_HTTP_URL, location.href);
                        _api.context.with(_api.trace.setSpan(_api.context.active(), fetchSpan), function () {
                            var _a;
                            if (!_this4._getConfig().ignoreNetworkEvents) {
                                (0, _sdkTraceWeb.addSpanNetworkEvents)(fetchSpan, entries);
                            }
                            _this4._addCustomAttributesOnSpan(fetchSpan, (_a = _this4._getConfig().applyCustomAttributesOnSpan) === null || _a === void 0 ? void 0 : _a.documentFetch);
                            _this4._endSpan(fetchSpan, _sdkTraceWeb.PerformanceTimingNames.RESPONSE_END, entries);
                        });
                    }
                });
                rootSpan.setAttribute(_semanticConventions.SEMATTRS_HTTP_URL, location.href);
                rootSpan.setAttribute(_semanticConventions.SEMATTRS_HTTP_USER_AGENT, navigator.userAgent);
                _this4._addResourcesSpans(rootSpan);
                if (!_this4._getConfig().ignoreNetworkEvents) {
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
                if (!_this4._getConfig().ignorePerformancePaintEvents) {
                    (0, _utils.addSpanPerformancePaintEvents)(rootSpan);
                }
                _this4._addCustomAttributesOnSpan(rootSpan, (_a = _this4._getConfig().applyCustomAttributesOnSpan) === null || _a === void 0 ? void 0 : _a.documentLoad);
                _this4._endSpan(rootSpan, _sdkTraceWeb.PerformanceTimingNames.LOAD_EVENT_END, entries);
            });
        }
        /**
         * Helper function for ending span
         * @param span
         * @param performanceName name of performance entry for time end
         * @param entries
         */

    }, {
        key: '_endSpan',
        value: function _endSpan(span, performanceName, entries) {
            // span can be undefined when entries are missing the certain performance - the span will not be created
            if (span) {
                if ((0, _sdkTraceWeb.hasKey)(entries, performanceName)) {
                    span.end(entries[performanceName]);
                } else {
                    // just end span
                    span.end();
                }
            }
        }
        /**
         * Creates and ends a span with network information about resource added as timed events
         * @param resource
         * @param parentSpan
         */

    }, {
        key: '_initResourceSpan',
        value: function _initResourceSpan(resource, parentSpan) {
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
        }
        /**
         * Helper function for starting a span
         * @param spanName name of span
         * @param performanceName name of performance entry for time start
         * @param entries
         * @param parentSpan
         */

    }, {
        key: '_startSpan',
        value: function _startSpan(spanName, performanceName, entries, parentSpan) {
            if ((0, _sdkTraceWeb.hasKey)(entries, performanceName) && typeof entries[performanceName] === 'number') {
                var span = this.tracer.startSpan(spanName, {
                    startTime: entries[performanceName]
                }, parentSpan ? _api.trace.setSpan(_api.context.active(), parentSpan) : undefined);
                return span;
            }
            return undefined;
        }
        /**
         * executes callback {_onDocumentLoaded} when the page is loaded
         */

    }, {
        key: '_waitForPageLoad',
        value: function _waitForPageLoad() {
            if (window.document.readyState === 'complete') {
                this._onDocumentLoaded();
            } else {
                this._onDocumentLoaded = this._onDocumentLoaded.bind(this);
                window.addEventListener('load', this._onDocumentLoaded);
            }
        }
    }, {
        key: '_getConfig',
        value: function _getConfig() {
            return this._config;
        }
        /**
         * adds custom attributes to root span if configured
         */

    }, {
        key: '_addCustomAttributesOnSpan',
        value: function _addCustomAttributesOnSpan(span, applyCustomAttributesOnSpan) {
            var _this5 = this;

            if (applyCustomAttributesOnSpan) {
                (0, _instrumentation.safeExecuteInTheMiddle)(function () {
                    return applyCustomAttributesOnSpan(span);
                }, function (error) {
                    if (!error) {
                        return;
                    }
                    _this5._diag.error('addCustomAttributesOnSpan', error);
                }, true);
            }
        }
        /**
         * adds custom attributes to span if configured
         */

    }, {
        key: '_addCustomAttributesOnResourceSpan',
        value: function _addCustomAttributesOnResourceSpan(span, resource, applyCustomAttributesOnSpan) {
            var _this6 = this;

            if (applyCustomAttributesOnSpan) {
                (0, _instrumentation.safeExecuteInTheMiddle)(function () {
                    return applyCustomAttributesOnSpan(span, resource);
                }, function (error) {
                    if (!error) {
                        return;
                    }
                    _this6._diag.error('addCustomAttributesOnResourceSpan', error);
                }, true);
            }
        }
        /**
         * implements enable function
         */

    }, {
        key: 'enable',
        value: function enable() {
            // remove previously attached load to avoid adding the same event twice
            // in case of multiple enable calling.
            window.removeEventListener('load', this._onDocumentLoaded);
            this._waitForPageLoad();
        }
        /**
         * implements disable function
         */

    }, {
        key: 'disable',
        value: function disable() {
            window.removeEventListener('load', this._onDocumentLoaded);
        }
    }]);

    return DocumentLoadInstrumentation;
}(_instrumentation.InstrumentationBase);
//# sourceMappingURL=instrumentation.js.map