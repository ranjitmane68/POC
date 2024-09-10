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
exports.NOOP_LOGGER_PROVIDER = exports.NoopLoggerProvider = void 0;
var NoopLogger_1 = require("./NoopLogger");

var NoopLoggerProvider = function () {
    function NoopLoggerProvider() {
        _classCallCheck(this, NoopLoggerProvider);
    }

    _createClass(NoopLoggerProvider, [{
        key: "getLogger",
        value: function getLogger(_name, _version, _options) {
            return new NoopLogger_1.NoopLogger();
        }
    }]);

    return NoopLoggerProvider;
}();

exports.NoopLoggerProvider = NoopLoggerProvider;
exports.NOOP_LOGGER_PROVIDER = new NoopLoggerProvider();
//# sourceMappingURL=NoopLoggerProvider.js.map