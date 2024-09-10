'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.addSpanPerformancePaintEvents = exports.getPerformanceNavigationEntries = undefined;

var _core = require('@opentelemetry/core');

var _sdkTraceWeb = require('@opentelemetry/sdk-trace-web');

var _EventNames = require('./enums/EventNames');

var getPerformanceNavigationEntries = exports.getPerformanceNavigationEntries = function getPerformanceNavigationEntries() {
    var _a, _b;
    var entries = {};
    var performanceNavigationTiming = (_b = (_a = _core.otperformance).getEntriesByType) === null || _b === void 0 ? void 0 : _b.call(_a, 'navigation')[0];
    if (performanceNavigationTiming) {
        var keys = Object.values(_sdkTraceWeb.PerformanceTimingNames);
        keys.forEach(function (key) {
            if ((0, _sdkTraceWeb.hasKey)(performanceNavigationTiming, key)) {
                var value = performanceNavigationTiming[key];
                if (typeof value === 'number') {
                    entries[key] = value;
                }
            }
        });
    } else {
        // // fallback to previous version
        var perf = _core.otperformance;
        var performanceTiming = perf.timing;
        if (performanceTiming) {
            var _keys = Object.values(_sdkTraceWeb.PerformanceTimingNames);
            _keys.forEach(function (key) {
                if ((0, _sdkTraceWeb.hasKey)(performanceTiming, key)) {
                    var value = performanceTiming[key];
                    if (typeof value === 'number') {
                        entries[key] = value;
                    }
                }
            });
        }
    }
    return entries;
}; /*
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

var performancePaintNames = {
    'first-paint': _EventNames.EventNames.FIRST_PAINT,
    'first-contentful-paint': _EventNames.EventNames.FIRST_CONTENTFUL_PAINT
};
var addSpanPerformancePaintEvents = exports.addSpanPerformancePaintEvents = function addSpanPerformancePaintEvents(span) {
    var _a, _b;
    var performancePaintTiming = (_b = (_a = _core.otperformance).getEntriesByType) === null || _b === void 0 ? void 0 : _b.call(_a, 'paint');
    if (performancePaintTiming) {
        performancePaintTiming.forEach(function (_ref) {
            var name = _ref.name,
                startTime = _ref.startTime;

            if ((0, _sdkTraceWeb.hasKey)(performancePaintNames, name)) {
                span.addEvent(performancePaintNames[name], startTime);
            }
        });
    }
};
//# sourceMappingURL=utils.js.map