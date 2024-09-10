'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.browserDetectorSync = undefined;

var _semanticConventions = require('@opentelemetry/semantic-conventions');

var _api = require('@opentelemetry/api');

var _Resource = require('../Resource');

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
var __assign = undefined && undefined.__assign || function () {
    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) {
                if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

/**
 * BrowserDetectorSync will be used to detect the resources related to browser.
 */
var BrowserDetectorSync = /** @class */function () {
    function BrowserDetectorSync() {}
    BrowserDetectorSync.prototype.detect = function (config) {
        var _a;
        var _b, _c, _d;
        var isBrowser = typeof navigator !== 'undefined' && ((_c = (_b = global.process) === null || _b === void 0 ? void 0 : _b.versions) === null || _c === void 0 ? void 0 : _c.node) === undefined && // Node.js v21 adds `navigator`
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore don't have Bun types
        ((_d = global.Bun) === null || _d === void 0 ? void 0 : _d.version) === undefined; // Bun (bun.sh) defines `navigator`
        if (!isBrowser) {
            return _Resource.Resource.empty();
        }
        var browserResource = (_a = {}, _a[_semanticConventions.SEMRESATTRS_PROCESS_RUNTIME_NAME] = 'browser', _a[_semanticConventions.SEMRESATTRS_PROCESS_RUNTIME_DESCRIPTION] = 'Web Browser', _a[_semanticConventions.SEMRESATTRS_PROCESS_RUNTIME_VERSION] = navigator.userAgent, _a);
        return this._getResourceAttributes(browserResource, config);
    };
    /**
     * Validates process resource attribute map from process variables
     *
     * @param browserResource The un-sanitized resource attributes from process as key/value pairs.
     * @param config: Config
     * @returns The sanitized resource attributes.
     */
    BrowserDetectorSync.prototype._getResourceAttributes = function (browserResource, _config) {
        if (browserResource[_semanticConventions.SEMRESATTRS_PROCESS_RUNTIME_VERSION] === '') {
            _api.diag.debug('BrowserDetector failed: Unable to find required browser resources. ');
            return _Resource.Resource.empty();
        } else {
            return new _Resource.Resource(__assign({}, browserResource));
        }
    };
    return BrowserDetectorSync;
}();
var browserDetectorSync = exports.browserDetectorSync = new BrowserDetectorSync();
//# sourceMappingURL=BrowserDetectorSync.js.map