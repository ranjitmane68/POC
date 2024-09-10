'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.hostDetectorSync = undefined;

var _semanticConventions = require('@opentelemetry/semantic-conventions');

var _Resource = require('../../../Resource');

var _os = require('os');

var _utils = require('./utils');

var _getMachineId = require('./machine-id/getMachineId');

/**
 * HostDetectorSync detects the resources related to the host current process is
 * running on. Currently only non-cloud-based attributes are included.
 */
var HostDetectorSync = /** @class */function () {
    function HostDetectorSync() {}
    HostDetectorSync.prototype.detect = function (_config) {
        var _a;
        var attributes = (_a = {}, _a[_semanticConventions.SEMRESATTRS_HOST_NAME] = (0, _os.hostname)(), _a[_semanticConventions.SEMRESATTRS_HOST_ARCH] = (0, _utils.normalizeArch)((0, _os.arch)()), _a);
        return new _Resource.Resource(attributes, this._getAsyncAttributes());
    };
    HostDetectorSync.prototype._getAsyncAttributes = function () {
        return (0, _getMachineId.getMachineId)().then(function (machineId) {
            var attributes = {};
            if (machineId) {
                attributes[_semanticConventions.SEMRESATTRS_HOST_ID] = machineId;
            }
            return attributes;
        });
    };
    return HostDetectorSync;
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
var hostDetectorSync = exports.hostDetectorSync = new HostDetectorSync();
//# sourceMappingURL=HostDetectorSync.js.map