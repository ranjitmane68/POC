'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.osDetectorSync = undefined;

var _semanticConventions = require('@opentelemetry/semantic-conventions');

var _Resource = require('../../../Resource');

var _os = require('os');

var _utils = require('./utils');

/**
 * OSDetectorSync detects the resources related to the operating system (OS) on
 * which the process represented by this resource is running.
 */
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
var OSDetectorSync = /** @class */function () {
    function OSDetectorSync() {}
    OSDetectorSync.prototype.detect = function (_config) {
        var _a;
        var attributes = (_a = {}, _a[_semanticConventions.SEMRESATTRS_OS_TYPE] = (0, _utils.normalizeType)((0, _os.platform)()), _a[_semanticConventions.SEMRESATTRS_OS_VERSION] = (0, _os.release)(), _a);
        return new _Resource.Resource(attributes);
    };
    return OSDetectorSync;
}();
var osDetectorSync = exports.osDetectorSync = new OSDetectorSync();
//# sourceMappingURL=OSDetectorSync.js.map