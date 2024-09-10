'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.processDetectorSync = undefined;

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


var _api = require('@opentelemetry/api');

var _semanticConventions = require('@opentelemetry/semantic-conventions');

var _Resource = require('../../../Resource');

var _os = require('os');

var os = _interopRequireWildcard(_os);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * ProcessDetectorSync will be used to detect the resources related current process running
 * and being instrumented from the NodeJS Process module.
 */
var ProcessDetectorSync = function () {
    function ProcessDetectorSync() {
        _classCallCheck(this, ProcessDetectorSync);
    }

    _createClass(ProcessDetectorSync, [{
        key: 'detect',
        value: function detect(_config) {
            var _attributes;

            var attributes = (_attributes = {}, _defineProperty(_attributes, _semanticConventions.SEMRESATTRS_PROCESS_PID, process.pid), _defineProperty(_attributes, _semanticConventions.SEMRESATTRS_PROCESS_EXECUTABLE_NAME, process.title), _defineProperty(_attributes, _semanticConventions.SEMRESATTRS_PROCESS_EXECUTABLE_PATH, process.execPath), _defineProperty(_attributes, _semanticConventions.SEMRESATTRS_PROCESS_COMMAND_ARGS, [process.argv[0]].concat(_toConsumableArray(process.execArgv), _toConsumableArray(process.argv.slice(1)))), _defineProperty(_attributes, _semanticConventions.SEMRESATTRS_PROCESS_RUNTIME_VERSION, process.versions.node), _defineProperty(_attributes, _semanticConventions.SEMRESATTRS_PROCESS_RUNTIME_NAME, 'nodejs'), _defineProperty(_attributes, _semanticConventions.SEMRESATTRS_PROCESS_RUNTIME_DESCRIPTION, 'Node.js'), _attributes);
            if (process.argv.length > 1) {
                attributes[_semanticConventions.SEMRESATTRS_PROCESS_COMMAND] = process.argv[1];
            }
            try {
                var userInfo = os.userInfo();
                attributes[_semanticConventions.SEMRESATTRS_PROCESS_OWNER] = userInfo.username;
            } catch (e) {
                _api.diag.debug('error obtaining process owner: ' + e);
            }
            return new _Resource.Resource(attributes);
        }
    }]);

    return ProcessDetectorSync;
}();

var processDetectorSync = exports.processDetectorSync = new ProcessDetectorSync();
//# sourceMappingURL=ProcessDetectorSync.js.map