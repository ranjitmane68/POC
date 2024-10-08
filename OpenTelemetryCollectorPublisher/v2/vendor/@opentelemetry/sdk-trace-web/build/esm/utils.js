'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.hasKey = hasKey;
exports.addSpanNetworkEvent = addSpanNetworkEvent;
exports.addSpanNetworkEvents = addSpanNetworkEvents;
exports.sortResources = sortResources;
exports.getResource = getResource;
exports.parseUrl = parseUrl;
exports.normalizeUrl = normalizeUrl;
exports.getElementXPath = getElementXPath;
exports.shouldPropagateTraceHeaders = shouldPropagateTraceHeaders;

var _PerformanceTimingNames = require('./enums/PerformanceTimingNames');

var _core = require('@opentelemetry/core');

var _semanticConventions = require('@opentelemetry/semantic-conventions');

// Used to normalize relative URLs
var urlNormalizingAnchor; /*
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

function getUrlNormalizingAnchor() {
    if (!urlNormalizingAnchor) {
        urlNormalizingAnchor = document.createElement('a');
    }
    return urlNormalizingAnchor;
}
/**
 * Helper function to be able to use enum as typed key in type and in interface when using forEach
 * @param obj
 * @param key
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function hasKey(obj, key) {
    return key in obj;
}
/**
 * Helper function for starting an event on span based on {@link PerformanceEntries}
 * @param span
 * @param performanceName name of performance entry for time start
 * @param entries
 * @param refPerfName name of performance entry to use for reference
 */
function addSpanNetworkEvent(span, performanceName, entries, refPerfName) {
    var perfTime = undefined;
    var refTime = undefined;
    if (hasKey(entries, performanceName) && typeof entries[performanceName] === 'number') {
        perfTime = entries[performanceName];
    }
    var refName = refPerfName || _PerformanceTimingNames.PerformanceTimingNames.FETCH_START;
    // Use a reference time which is the earliest possible value so that the performance timings that are earlier should not be added
    // using FETCH START time in case no reference is provided
    if (hasKey(entries, refName) && typeof entries[refName] === 'number') {
        refTime = entries[refName];
    }
    if (perfTime !== undefined && refTime !== undefined && perfTime >= refTime) {
        span.addEvent(performanceName, perfTime);
        return span;
    }
    return undefined;
}
/**
 * Helper function for adding network events
 * @param span
 * @param resource
 */
function addSpanNetworkEvents(span, resource) {
    addSpanNetworkEvent(span, _PerformanceTimingNames.PerformanceTimingNames.FETCH_START, resource);
    addSpanNetworkEvent(span, _PerformanceTimingNames.PerformanceTimingNames.DOMAIN_LOOKUP_START, resource);
    addSpanNetworkEvent(span, _PerformanceTimingNames.PerformanceTimingNames.DOMAIN_LOOKUP_END, resource);
    addSpanNetworkEvent(span, _PerformanceTimingNames.PerformanceTimingNames.CONNECT_START, resource);
    if (hasKey(resource, 'name') && resource['name'].startsWith('https:')) {
        addSpanNetworkEvent(span, _PerformanceTimingNames.PerformanceTimingNames.SECURE_CONNECTION_START, resource);
    }
    addSpanNetworkEvent(span, _PerformanceTimingNames.PerformanceTimingNames.CONNECT_END, resource);
    addSpanNetworkEvent(span, _PerformanceTimingNames.PerformanceTimingNames.REQUEST_START, resource);
    addSpanNetworkEvent(span, _PerformanceTimingNames.PerformanceTimingNames.RESPONSE_START, resource);
    addSpanNetworkEvent(span, _PerformanceTimingNames.PerformanceTimingNames.RESPONSE_END, resource);
    var encodedLength = resource[_PerformanceTimingNames.PerformanceTimingNames.ENCODED_BODY_SIZE];
    if (encodedLength !== undefined) {
        span.setAttribute(_semanticConventions.SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH, encodedLength);
    }
    var decodedLength = resource[_PerformanceTimingNames.PerformanceTimingNames.DECODED_BODY_SIZE];
    // Spec: Not set if transport encoding not used (in which case encoded and decoded sizes match)
    if (decodedLength !== undefined && encodedLength !== decodedLength) {
        span.setAttribute(_semanticConventions.SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED, decodedLength);
    }
}
/**
 * sort resources by startTime
 * @param filteredResources
 */
function sortResources(filteredResources) {
    return filteredResources.slice().sort(function (a, b) {
        var valueA = a[_PerformanceTimingNames.PerformanceTimingNames.FETCH_START];
        var valueB = b[_PerformanceTimingNames.PerformanceTimingNames.FETCH_START];
        if (valueA > valueB) {
            return 1;
        } else if (valueA < valueB) {
            return -1;
        }
        return 0;
    });
}
/** Returns the origin if present (if in browser context). */
function getOrigin() {
    return typeof location !== 'undefined' ? location.origin : undefined;
}
/**
 * Get closest performance resource ignoring the resources that have been
 * already used.
 * @param spanUrl
 * @param startTimeHR
 * @param endTimeHR
 * @param resources
 * @param ignoredResources
 * @param initiatorType
 */
function getResource(spanUrl, startTimeHR, endTimeHR, resources, ignoredResources, initiatorType) {
    if (ignoredResources === void 0) {
        ignoredResources = new WeakSet();
    }
    // de-relativize the URL before usage (does no harm to absolute URLs)
    var parsedSpanUrl = parseUrl(spanUrl);
    spanUrl = parsedSpanUrl.toString();
    var filteredResources = filterResourcesForSpan(spanUrl, startTimeHR, endTimeHR, resources, ignoredResources, initiatorType);
    if (filteredResources.length === 0) {
        return {
            mainRequest: undefined
        };
    }
    if (filteredResources.length === 1) {
        return {
            mainRequest: filteredResources[0]
        };
    }
    var sorted = sortResources(filteredResources);
    if (parsedSpanUrl.origin !== getOrigin() && sorted.length > 1) {
        var corsPreFlightRequest = sorted[0];
        var mainRequest = findMainRequest(sorted, corsPreFlightRequest[_PerformanceTimingNames.PerformanceTimingNames.RESPONSE_END], endTimeHR);
        var responseEnd = corsPreFlightRequest[_PerformanceTimingNames.PerformanceTimingNames.RESPONSE_END];
        var fetchStart = mainRequest[_PerformanceTimingNames.PerformanceTimingNames.FETCH_START];
        // no corsPreFlightRequest
        if (fetchStart < responseEnd) {
            mainRequest = corsPreFlightRequest;
            corsPreFlightRequest = undefined;
        }
        return {
            corsPreFlightRequest: corsPreFlightRequest,
            mainRequest: mainRequest
        };
    } else {
        return {
            mainRequest: filteredResources[0]
        };
    }
}
/**
 * Will find the main request skipping the cors pre flight requests
 * @param resources
 * @param corsPreFlightRequestEndTime
 * @param spanEndTimeHR
 */
function findMainRequest(resources, corsPreFlightRequestEndTime, spanEndTimeHR) {
    var spanEndTime = (0, _core.hrTimeToNanoseconds)(spanEndTimeHR);
    var minTime = (0, _core.hrTimeToNanoseconds)((0, _core.timeInputToHrTime)(corsPreFlightRequestEndTime));
    var mainRequest = resources[1];
    var bestGap;
    var length = resources.length;
    for (var i = 1; i < length; i++) {
        var resource = resources[i];
        var resourceStartTime = (0, _core.hrTimeToNanoseconds)((0, _core.timeInputToHrTime)(resource[_PerformanceTimingNames.PerformanceTimingNames.FETCH_START]));
        var resourceEndTime = (0, _core.hrTimeToNanoseconds)((0, _core.timeInputToHrTime)(resource[_PerformanceTimingNames.PerformanceTimingNames.RESPONSE_END]));
        var currentGap = spanEndTime - resourceEndTime;
        if (resourceStartTime >= minTime && (!bestGap || currentGap < bestGap)) {
            bestGap = currentGap;
            mainRequest = resource;
        }
    }
    return mainRequest;
}
/**
 * Filter all resources that has started and finished according to span start time and end time.
 *     It will return the closest resource to a start time
 * @param spanUrl
 * @param startTimeHR
 * @param endTimeHR
 * @param resources
 * @param ignoredResources
 */
function filterResourcesForSpan(spanUrl, startTimeHR, endTimeHR, resources, ignoredResources, initiatorType) {
    var startTime = (0, _core.hrTimeToNanoseconds)(startTimeHR);
    var endTime = (0, _core.hrTimeToNanoseconds)(endTimeHR);
    var filteredResources = resources.filter(function (resource) {
        var resourceStartTime = (0, _core.hrTimeToNanoseconds)((0, _core.timeInputToHrTime)(resource[_PerformanceTimingNames.PerformanceTimingNames.FETCH_START]));
        var resourceEndTime = (0, _core.hrTimeToNanoseconds)((0, _core.timeInputToHrTime)(resource[_PerformanceTimingNames.PerformanceTimingNames.RESPONSE_END]));
        return resource.initiatorType.toLowerCase() === (initiatorType || 'xmlhttprequest') && resource.name === spanUrl && resourceStartTime >= startTime && resourceEndTime <= endTime;
    });
    if (filteredResources.length > 0) {
        filteredResources = filteredResources.filter(function (resource) {
            return !ignoredResources.has(resource);
        });
    }
    return filteredResources;
}
/**
 * Parses url using URL constructor or fallback to anchor element.
 * @param url
 */
function parseUrl(url) {
    if (typeof URL === 'function') {
        return new URL(url, typeof document !== 'undefined' ? document.baseURI : typeof location !== 'undefined' // Some JS runtimes (e.g. Deno) don't define this
        ? location.href : undefined);
    }
    var element = getUrlNormalizingAnchor();
    element.href = url;
    return element;
}
/**
 * Parses url using URL constructor or fallback to anchor element and serialize
 * it to a string.
 *
 * Performs the steps described in https://html.spec.whatwg.org/multipage/urls-and-fetching.html#parse-a-url
 *
 * @param url
 */
function normalizeUrl(url) {
    var urlLike = parseUrl(url);
    return urlLike.href;
}
/**
 * Get element XPath
 * @param target - target element
 * @param optimised - when id attribute of element is present the xpath can be
 * simplified to contain id
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
function getElementXPath(target, optimised) {
    if (target.nodeType === Node.DOCUMENT_NODE) {
        return '/';
    }
    var targetValue = getNodeValue(target, optimised);
    if (optimised && targetValue.indexOf('@id') > 0) {
        return targetValue;
    }
    var xpath = '';
    if (target.parentNode) {
        xpath += getElementXPath(target.parentNode, false);
    }
    xpath += targetValue;
    return xpath;
}
/**
 * get node index within the siblings
 * @param target
 */
function getNodeIndex(target) {
    if (!target.parentNode) {
        return 0;
    }
    var allowedTypes = [target.nodeType];
    if (target.nodeType === Node.CDATA_SECTION_NODE) {
        allowedTypes.push(Node.TEXT_NODE);
    }
    var elements = Array.from(target.parentNode.childNodes);
    elements = elements.filter(function (element) {
        var localName = element.localName;
        return allowedTypes.indexOf(element.nodeType) >= 0 && localName === target.localName;
    });
    if (elements.length >= 1) {
        return elements.indexOf(target) + 1; // xpath starts from 1
    }
    // if there are no other similar child xpath doesn't need index
    return 0;
}
/**
 * get node value for xpath
 * @param target
 * @param optimised
 */
function getNodeValue(target, optimised) {
    var nodeType = target.nodeType;
    var index = getNodeIndex(target);
    var nodeValue = '';
    if (nodeType === Node.ELEMENT_NODE) {
        var id = target.getAttribute('id');
        if (optimised && id) {
            return "//*[@id=\"" + id + "\"]";
        }
        nodeValue = target.localName;
    } else if (nodeType === Node.TEXT_NODE || nodeType === Node.CDATA_SECTION_NODE) {
        nodeValue = 'text()';
    } else if (nodeType === Node.COMMENT_NODE) {
        nodeValue = 'comment()';
    } else {
        return '';
    }
    // if index is 1 it can be omitted in xpath
    if (nodeValue && index > 1) {
        return "/" + nodeValue + "[" + index + "]";
    }
    return "/" + nodeValue;
}
/**
 * Checks if trace headers should be propagated
 * @param spanUrl
 * @private
 */
function shouldPropagateTraceHeaders(spanUrl, propagateTraceHeaderCorsUrls) {
    var propagateTraceHeaderUrls = propagateTraceHeaderCorsUrls || [];
    if (typeof propagateTraceHeaderUrls === 'string' || propagateTraceHeaderUrls instanceof RegExp) {
        propagateTraceHeaderUrls = [propagateTraceHeaderUrls];
    }
    var parsedSpanUrl = parseUrl(spanUrl);
    if (parsedSpanUrl.origin === getOrigin()) {
        return true;
    } else {
        return propagateTraceHeaderUrls.some(function (propagateTraceHeaderUrl) {
            return (0, _core.urlMatches)(spanUrl, propagateTraceHeaderUrl);
        });
    }
}
//# sourceMappingURL=utils.js.map