'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.trace = undefined;

var _trace = require('./api/trace');

/** Entrypoint for trace API */
var trace = exports.trace = _trace.TraceAPI.getInstance();
//# sourceMappingURL=trace-api.js.map
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
// Split module-level variable definition into separate files to allow
// tree-shaking on each api instance.