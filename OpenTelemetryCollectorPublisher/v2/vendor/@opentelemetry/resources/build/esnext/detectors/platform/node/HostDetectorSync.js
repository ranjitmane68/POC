'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.hostDetectorSync = undefined;

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

var _Resource = require('../../../Resource');

var _os = require('os');

var _utils = require('./utils');

var _getMachineId = require('./machine-id/getMachineId');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * HostDetectorSync detects the resources related to the host current process is
 * running on. Currently only non-cloud-based attributes are included.
 */
var HostDetectorSync = function () {
    function HostDetectorSync() {
        _classCallCheck(this, HostDetectorSync);
    }

    _createClass(HostDetectorSync, [{
        key: 'detect',
        value: function detect(_config) {
            var _attributes;

            var attributes = (_attributes = {}, _defineProperty(_attributes, _semanticConventions.SEMRESATTRS_HOST_NAME, (0, _os.hostname)()), _defineProperty(_attributes, _semanticConventions.SEMRESATTRS_HOST_ARCH, (0, _utils.normalizeArch)((0, _os.arch)())), _attributes);
            return new _Resource.Resource(attributes, this._getAsyncAttributes());
        }
    }, {
        key: '_getAsyncAttributes',
        value: function _getAsyncAttributes() {
            return (0, _getMachineId.getMachineId)().then(function (machineId) {
                var attributes = {};
                if (machineId) {
                    attributes[_semanticConventions.SEMRESATTRS_HOST_ID] = machineId;
                }
                return attributes;
            });
        }
    }]);

    return HostDetectorSync;
}();

var hostDetectorSync = exports.hostDetectorSync = new HostDetectorSync();
//# sourceMappingURL=HostDetectorSync.js.map