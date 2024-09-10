'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setGlobalErrorHandler = setGlobalErrorHandler;
exports.globalErrorHandler = globalErrorHandler;

var _loggingErrorHandler = require('./logging-error-handler');

/** The global error handler delegate */
var delegateHandler = (0, _loggingErrorHandler.loggingErrorHandler)();
/**
 * Set the global error handler
 * @param {ErrorHandler} handler
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
function setGlobalErrorHandler(handler) {
  delegateHandler = handler;
}
/**
 * Return the global error handler
 * @param {Exception} ex
 */
function globalErrorHandler(ex) {
  try {
    delegateHandler(ex);
  } catch (_a) {} // eslint-disable-line no-empty
}
//# sourceMappingURL=global-error-handler.js.map