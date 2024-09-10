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
exports.hostDetectorSync = void 0;
var semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
var Resource_1 = require("../../../Resource");
var os_1 = require("os");
var utils_1 = require("./utils");
var getMachineId_1 = require("./machine-id/getMachineId");
/**
 * HostDetectorSync detects the resources related to the host current process is
 * running on. Currently only non-cloud-based attributes are included.
 */

var HostDetectorSync = function () {
    function HostDetectorSync() {
        _classCallCheck(this, HostDetectorSync);
    }

    _createClass(HostDetectorSync, [{
        key: "detect",
        value: function detect(_config) {
            var _attributes;

            var attributes = (_attributes = {}, _defineProperty(_attributes, semantic_conventions_1.SEMRESATTRS_HOST_NAME, (0, os_1.hostname)()), _defineProperty(_attributes, semantic_conventions_1.SEMRESATTRS_HOST_ARCH, (0, utils_1.normalizeArch)((0, os_1.arch)())), _attributes);
            return new Resource_1.Resource(attributes, this._getAsyncAttributes());
        }
    }, {
        key: "_getAsyncAttributes",
        value: function _getAsyncAttributes() {
            return (0, getMachineId_1.getMachineId)().then(function (machineId) {
                var attributes = {};
                if (machineId) {
                    attributes[semantic_conventions_1.SEMRESATTRS_HOST_ID] = machineId;
                }
                return attributes;
            });
        }
    }]);

    return HostDetectorSync;
}();

exports.hostDetectorSync = new HostDetectorSync();
//# sourceMappingURL=HostDetectorSync.js.map