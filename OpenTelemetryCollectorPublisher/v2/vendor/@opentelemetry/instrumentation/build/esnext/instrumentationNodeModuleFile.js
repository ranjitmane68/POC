'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.InstrumentationNodeModuleFile = undefined;

var _index = require('./platform/index');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /*
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


var InstrumentationNodeModuleFile = exports.InstrumentationNodeModuleFile = function InstrumentationNodeModuleFile(name, supportedVersions,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
patch,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
unpatch) {
    _classCallCheck(this, InstrumentationNodeModuleFile);

    this.supportedVersions = supportedVersions;
    this.patch = patch;
    this.unpatch = unpatch;
    this.name = (0, _index.normalize)(name);
};
//# sourceMappingURL=instrumentationNodeModuleFile.js.map