'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerInstrumentations = registerInstrumentations;

var _api = require('@opentelemetry/api');

var _apiLogs = require('@opentelemetry/api-logs');

var _autoLoaderUtils = require('./autoLoaderUtils');

/**
 * It will register instrumentations and plugins
 * @param options
 * @return returns function to unload instrumentation and plugins that were
 *   registered
 */
function registerInstrumentations(options) {
  var _a, _b;
  var tracerProvider = options.tracerProvider || _api.trace.getTracerProvider();
  var meterProvider = options.meterProvider || _api.metrics.getMeterProvider();
  var loggerProvider = options.loggerProvider || _apiLogs.logs.getLoggerProvider();
  var instrumentations = (_b = (_a = options.instrumentations) === null || _a === void 0 ? void 0 : _a.flat()) !== null && _b !== void 0 ? _b : [];
  (0, _autoLoaderUtils.enableInstrumentations)(instrumentations, tracerProvider, meterProvider, loggerProvider);
  return function () {
    (0, _autoLoaderUtils.disableInstrumentations)(instrumentations);
  };
}
//# sourceMappingURL=autoLoader.js.map
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