"use strict";
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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceInstanceIdDetectorSync = void 0;
var semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
var Resource_1 = require("../../../Resource");
var crypto_1 = require("crypto");
/**
 * ServiceInstanceIdDetectorSync detects the resources related to the service instance ID.
 */

var ServiceInstanceIdDetectorSync = function () {
  function ServiceInstanceIdDetectorSync() {
    _classCallCheck(this, ServiceInstanceIdDetectorSync);
  }

  _createClass(ServiceInstanceIdDetectorSync, [{
    key: "detect",
    value: function detect(_config) {
      var attributes = _defineProperty({}, semantic_conventions_1.SEMRESATTRS_SERVICE_INSTANCE_ID, (0, crypto_1.randomUUID)());
      return new Resource_1.Resource(attributes);
    }
  }]);

  return ServiceInstanceIdDetectorSync;
}();
/**
 * @experimental
 */


exports.serviceInstanceIdDetectorSync = new ServiceInstanceIdDetectorSync();
//# sourceMappingURL=ServiceInstanceIdDetectorSync.js.map