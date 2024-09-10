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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerProviderSharedState = void 0;
var NoopLogRecordProcessor_1 = require("../export/NoopLogRecordProcessor");

var LoggerProviderSharedState = function LoggerProviderSharedState(resource, forceFlushTimeoutMillis, logRecordLimits) {
    _classCallCheck(this, LoggerProviderSharedState);

    this.resource = resource;
    this.forceFlushTimeoutMillis = forceFlushTimeoutMillis;
    this.logRecordLimits = logRecordLimits;
    this.loggers = new Map();
    this.registeredLogRecordProcessors = [];
    this.activeProcessor = new NoopLogRecordProcessor_1.NoopLogRecordProcessor();
};

exports.LoggerProviderSharedState = LoggerProviderSharedState;
//# sourceMappingURL=LoggerProviderSharedState.js.map