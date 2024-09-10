'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hostDetector = undefined;

var _HostDetectorSync = require('./HostDetectorSync');

/**
 * HostDetector detects the resources related to the host current process is
 * running on. Currently only non-cloud-based attributes are included.
 */
var HostDetector = /** @class */function () {
  function HostDetector() {}
  HostDetector.prototype.detect = function (_config) {
    return Promise.resolve(_HostDetectorSync.hostDetectorSync.detect(_config));
  };
  return HostDetector;
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
var hostDetector = exports.hostDetector = new HostDetector();
//# sourceMappingURL=HostDetector.js.map