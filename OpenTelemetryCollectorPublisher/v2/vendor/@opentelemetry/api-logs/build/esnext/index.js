'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logs = undefined;

var _Logger = require('./types/Logger');

Object.keys(_Logger).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Logger[key];
    }
  });
});

var _LoggerProvider = require('./types/LoggerProvider');

Object.keys(_LoggerProvider).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _LoggerProvider[key];
    }
  });
});

var _LogRecord = require('./types/LogRecord');

Object.keys(_LogRecord).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _LogRecord[key];
    }
  });
});

var _LoggerOptions = require('./types/LoggerOptions');

Object.keys(_LoggerOptions).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _LoggerOptions[key];
    }
  });
});

var _AnyValue = require('./types/AnyValue');

Object.keys(_AnyValue).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _AnyValue[key];
    }
  });
});

var _NoopLogger = require('./NoopLogger');

Object.keys(_NoopLogger).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _NoopLogger[key];
    }
  });
});

var _NoopLoggerProvider = require('./NoopLoggerProvider');

Object.keys(_NoopLoggerProvider).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _NoopLoggerProvider[key];
    }
  });
});

var _logs = require('./api/logs');

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
var logs = exports.logs = _logs.LogsAPI.getInstance();
//# sourceMappingURL=index.js.map