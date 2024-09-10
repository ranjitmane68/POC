'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.INVALID_SPAN_CONTEXT = exports.INVALID_TRACEID = exports.INVALID_SPANID = undefined;

var _trace_flags = require('./trace_flags');

var INVALID_SPANID = exports.INVALID_SPANID = '0000000000000000'; /*
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
var INVALID_TRACEID = exports.INVALID_TRACEID = '00000000000000000000000000000000';
var INVALID_SPAN_CONTEXT = exports.INVALID_SPAN_CONTEXT = {
  traceId: INVALID_TRACEID,
  spanId: INVALID_SPANID,
  traceFlags: _trace_flags.TraceFlags.NONE
};
//# sourceMappingURL=invalid-span-constants.js.map