'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.osDetector = undefined;

var _OSDetectorSync = require('./OSDetectorSync');

/**
 * OSDetector detects the resources related to the operating system (OS) on
 * which the process represented by this resource is running.
 */
var OSDetector = /** @class */function () {
  function OSDetector() {}
  OSDetector.prototype.detect = function (_config) {
    return Promise.resolve(_OSDetectorSync.osDetectorSync.detect(_config));
  };
  return OSDetector;
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
var osDetector = exports.osDetector = new OSDetector();
//# sourceMappingURL=OSDetector.js.map