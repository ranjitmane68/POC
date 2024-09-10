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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
exports.AnchoredClock = void 0;
/**
 * A utility for returning wall times anchored to a given point in time. Wall time measurements will
 * not be taken from the system, but instead are computed by adding a monotonic clock time
 * to the anchor point.
 *
 * This is needed because the system time can change and result in unexpected situations like
 * spans ending before they are started. Creating an anchored clock for each local root span
 * ensures that span timings and durations are accurate while preventing span times from drifting
 * too far from the system clock.
 *
 * Only creating an anchored clock once per local trace ensures span times are correct relative
 * to each other. For example, a child span will never have a start time before its parent even
 * if the system clock is corrected during the local trace.
 *
 * Heavily inspired by the OTel Java anchored clock
 * https://github.com/open-telemetry/opentelemetry-java/blob/main/sdk/trace/src/main/java/io/opentelemetry/sdk/trace/AnchoredClock.java
 */

var AnchoredClock = function () {
  /**
   * Create a new AnchoredClock anchored to the current time returned by systemClock.
   *
   * @param systemClock should be a clock that returns the number of milliseconds since January 1 1970 such as Date
   * @param monotonicClock should be a clock that counts milliseconds monotonically such as window.performance or perf_hooks.performance
   */
  function AnchoredClock(systemClock, monotonicClock) {
    _classCallCheck(this, AnchoredClock);

    this._monotonicClock = monotonicClock;
    this._epochMillis = systemClock.now();
    this._performanceMillis = monotonicClock.now();
  }
  /**
   * Returns the current time by adding the number of milliseconds since the
   * AnchoredClock was created to the creation epoch time
   */


  _createClass(AnchoredClock, [{
    key: "now",
    value: function now() {
      var delta = this._monotonicClock.now() - this._performanceMillis;
      return this._epochMillis + delta;
    }
  }]);

  return AnchoredClock;
}();

exports.AnchoredClock = AnchoredClock;
//# sourceMappingURL=anchored-clock.js.map