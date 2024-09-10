'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.browserDetectorSync = undefined;

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


var _semanticConventions = require('@opentelemetry/semantic-conventions');

var _api = require('@opentelemetry/api');

var _Resource = require('../Resource');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * BrowserDetectorSync will be used to detect the resources related to browser.
 */
var BrowserDetectorSync = function () {
    function BrowserDetectorSync() {
        _classCallCheck(this, BrowserDetectorSync);
    }

    _createClass(BrowserDetectorSync, [{
        key: 'detect',
        value: function detect(config) {
            var _browserResource;

            var _a, _b, _c;
            var isBrowser = typeof navigator !== 'undefined' && ((_b = (_a = global.process) === null || _a === void 0 ? void 0 : _a.versions) === null || _b === void 0 ? void 0 : _b.node) === undefined && // Node.js v21 adds `navigator`
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore don't have Bun types
            ((_c = global.Bun) === null || _c === void 0 ? void 0 : _c.version) === undefined; // Bun (bun.sh) defines `navigator`
            if (!isBrowser) {
                return _Resource.Resource.empty();
            }
            var browserResource = (_browserResource = {}, _defineProperty(_browserResource, _semanticConventions.SEMRESATTRS_PROCESS_RUNTIME_NAME, 'browser'), _defineProperty(_browserResource, _semanticConventions.SEMRESATTRS_PROCESS_RUNTIME_DESCRIPTION, 'Web Browser'), _defineProperty(_browserResource, _semanticConventions.SEMRESATTRS_PROCESS_RUNTIME_VERSION, navigator.userAgent), _browserResource);
            return this._getResourceAttributes(browserResource, config);
        }
        /**
         * Validates process resource attribute map from process variables
         *
         * @param browserResource The un-sanitized resource attributes from process as key/value pairs.
         * @param config: Config
         * @returns The sanitized resource attributes.
         */

    }, {
        key: '_getResourceAttributes',
        value: function _getResourceAttributes(browserResource, _config) {
            if (browserResource[_semanticConventions.SEMRESATTRS_PROCESS_RUNTIME_VERSION] === '') {
                _api.diag.debug('BrowserDetector failed: Unable to find required browser resources. ');
                return _Resource.Resource.empty();
            } else {
                return new _Resource.Resource(Object.assign({}, browserResource));
            }
        }
    }]);

    return BrowserDetectorSync;
}();

var browserDetectorSync = exports.browserDetectorSync = new BrowserDetectorSync();
//# sourceMappingURL=BrowserDetectorSync.js.map