'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SDK_INFO = undefined;

var _SDK_INFO;

var _version = require('../../version');

var _semanticConventions = require('@opentelemetry/semantic-conventions');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } /*
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


/** Constants describing the SDK in use */
var SDK_INFO = exports.SDK_INFO = (_SDK_INFO = {}, _defineProperty(_SDK_INFO, _semanticConventions.SEMRESATTRS_TELEMETRY_SDK_NAME, 'opentelemetry'), _defineProperty(_SDK_INFO, _semanticConventions.SEMRESATTRS_PROCESS_RUNTIME_NAME, 'browser'), _defineProperty(_SDK_INFO, _semanticConventions.SEMRESATTRS_TELEMETRY_SDK_LANGUAGE, _semanticConventions.TELEMETRYSDKLANGUAGEVALUES_WEBJS), _defineProperty(_SDK_INFO, _semanticConventions.SEMRESATTRS_TELEMETRY_SDK_VERSION, _version.VERSION), _SDK_INFO);
//# sourceMappingURL=sdk-info.js.map