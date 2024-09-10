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
exports.Logger = void 0;
var api_1 = require("@opentelemetry/api");
var LogRecord_1 = require("./LogRecord");

var Logger = function () {
  function Logger(instrumentationScope, _sharedState) {
    _classCallCheck(this, Logger);

    this.instrumentationScope = instrumentationScope;
    this._sharedState = _sharedState;
  }

  _createClass(Logger, [{
    key: "emit",
    value: function emit(logRecord) {
      var currentContext = logRecord.context || api_1.context.active();
      /**
       * If a Logger was obtained with include_trace_context=true,
       * the LogRecords it emits MUST automatically include the Trace Context from the active Context,
       * if Context has not been explicitly set.
       */
      var logRecordInstance = new LogRecord_1.LogRecord(this._sharedState, this.instrumentationScope, Object.assign({ context: currentContext }, logRecord));
      /**
       * the explicitly passed Context,
       * the current Context, or an empty Context if the Logger was obtained with include_trace_context=false
       */
      this._sharedState.activeProcessor.onEmit(logRecordInstance, currentContext);
      /**
       * A LogRecordProcessor may freely modify logRecord for the duration of the OnEmit call.
       * If logRecord is needed after OnEmit returns (i.e. for asynchronous processing) only reads are permitted.
       */
      logRecordInstance._makeReadonly();
    }
  }]);

  return Logger;
}();

exports.Logger = Logger;
//# sourceMappingURL=Logger.js.map