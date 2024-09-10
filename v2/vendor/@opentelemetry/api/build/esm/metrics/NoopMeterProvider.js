'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NOOP_METER_PROVIDER = exports.NoopMeterProvider = undefined;

var _NoopMeter = require('./NoopMeter');

/**
 * An implementation of the {@link MeterProvider} which returns an impotent Meter
 * for all calls to `getMeter`
 */
var NoopMeterProvider = /** @class */function () {
  function NoopMeterProvider() {}
  NoopMeterProvider.prototype.getMeter = function (_name, _version, _options) {
    return _NoopMeter.NOOP_METER;
  };
  return NoopMeterProvider;
}(); /*
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
exports.NoopMeterProvider = NoopMeterProvider;
var NOOP_METER_PROVIDER = exports.NOOP_METER_PROVIDER = new NoopMeterProvider();
//# sourceMappingURL=NoopMeterProvider.js.map