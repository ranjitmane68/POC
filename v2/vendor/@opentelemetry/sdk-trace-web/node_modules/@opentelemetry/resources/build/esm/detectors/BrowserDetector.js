'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.browserDetector = undefined;

var _BrowserDetectorSync = require('./BrowserDetectorSync');

/**
 * BrowserDetector will be used to detect the resources related to browser.
 */
var BrowserDetector = /** @class */function () {
  function BrowserDetector() {}
  BrowserDetector.prototype.detect = function (config) {
    return Promise.resolve(_BrowserDetectorSync.browserDetectorSync.detect(config));
  };
  return BrowserDetector;
}(); /*
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
var browserDetector = exports.browserDetector = new BrowserDetector();
//# sourceMappingURL=BrowserDetector.js.map