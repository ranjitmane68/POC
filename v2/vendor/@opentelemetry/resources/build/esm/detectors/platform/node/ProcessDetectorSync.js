"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.processDetectorSync = undefined;

var _api = require("@opentelemetry/api");

var _semanticConventions = require("@opentelemetry/semantic-conventions");

var _Resource = require("../../../Resource");

var _os = require("os");

var os = _interopRequireWildcard(_os);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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
var __read = undefined && undefined.__read || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o),
        r,
        ar = [],
        e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) {
            ar.push(r.value);
        }
    } catch (error) {
        e = { error: error };
    } finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        } finally {
            if (e) throw e.error;
        }
    }
    return ar;
};
var __spreadArray = undefined && undefined.__spreadArray || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};

/**
 * ProcessDetectorSync will be used to detect the resources related current process running
 * and being instrumented from the NodeJS Process module.
 */
var ProcessDetectorSync = /** @class */function () {
    function ProcessDetectorSync() {}
    ProcessDetectorSync.prototype.detect = function (_config) {
        var _a;
        var attributes = (_a = {}, _a[_semanticConventions.SEMRESATTRS_PROCESS_PID] = process.pid, _a[_semanticConventions.SEMRESATTRS_PROCESS_EXECUTABLE_NAME] = process.title, _a[_semanticConventions.SEMRESATTRS_PROCESS_EXECUTABLE_PATH] = process.execPath, _a[_semanticConventions.SEMRESATTRS_PROCESS_COMMAND_ARGS] = __spreadArray(__spreadArray([process.argv[0]], __read(process.execArgv), false), __read(process.argv.slice(1)), false), _a[_semanticConventions.SEMRESATTRS_PROCESS_RUNTIME_VERSION] = process.versions.node, _a[_semanticConventions.SEMRESATTRS_PROCESS_RUNTIME_NAME] = 'nodejs', _a[_semanticConventions.SEMRESATTRS_PROCESS_RUNTIME_DESCRIPTION] = 'Node.js', _a);
        if (process.argv.length > 1) {
            attributes[_semanticConventions.SEMRESATTRS_PROCESS_COMMAND] = process.argv[1];
        }
        try {
            var userInfo = os.userInfo();
            attributes[_semanticConventions.SEMRESATTRS_PROCESS_OWNER] = userInfo.username;
        } catch (e) {
            _api.diag.debug("error obtaining process owner: " + e);
        }
        return new _Resource.Resource(attributes);
    };
    return ProcessDetectorSync;
}();
var processDetectorSync = exports.processDetectorSync = new ProcessDetectorSync();
//# sourceMappingURL=ProcessDetectorSync.js.map