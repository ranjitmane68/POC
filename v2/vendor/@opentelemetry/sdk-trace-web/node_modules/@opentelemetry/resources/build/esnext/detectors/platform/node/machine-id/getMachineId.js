'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getMachineId = undefined;

var _process = require('process');

var process = _interopRequireWildcard(_process);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var getMachineId = void 0; /*
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

switch (process.platform) {
    case 'darwin':
        var _require = require('./getMachineId-darwin');

        exports.getMachineId = getMachineId = _require.getMachineId;

        break;
    case 'linux':
        var _require2 = require('./getMachineId-linux');

        exports.getMachineId = getMachineId = _require2.getMachineId;

        break;
    case 'freebsd':
        var _require3 = require('./getMachineId-bsd');

        exports.getMachineId = getMachineId = _require3.getMachineId;

        break;
    case 'win32':
        var _require4 = require('./getMachineId-win');

        exports.getMachineId = getMachineId = _require4.getMachineId;

        break;
    default:
        var _require5 = require('./getMachineId-unsupported');

        exports.getMachineId = getMachineId = _require5.getMachineId;

}
exports.getMachineId = getMachineId;
//# sourceMappingURL=getMachineId.js.map