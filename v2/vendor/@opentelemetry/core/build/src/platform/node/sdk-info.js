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

var _exports$SDK_INFO;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

Object.defineProperty(exports, "__esModule", { value: true });
exports.SDK_INFO = void 0;
var version_1 = require("../../version");
var semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
/** Constants describing the SDK in use */
exports.SDK_INFO = (_exports$SDK_INFO = {}, _defineProperty(_exports$SDK_INFO, semantic_conventions_1.SEMRESATTRS_TELEMETRY_SDK_NAME, 'opentelemetry'), _defineProperty(_exports$SDK_INFO, semantic_conventions_1.SEMRESATTRS_PROCESS_RUNTIME_NAME, 'node'), _defineProperty(_exports$SDK_INFO, semantic_conventions_1.SEMRESATTRS_TELEMETRY_SDK_LANGUAGE, semantic_conventions_1.TELEMETRYSDKLANGUAGEVALUES_NODEJS), _defineProperty(_exports$SDK_INFO, semantic_conventions_1.SEMRESATTRS_TELEMETRY_SDK_VERSION, version_1.VERSION), _exports$SDK_INFO);
//# sourceMappingURL=sdk-info.js.map