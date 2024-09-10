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

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
exports.InstrumentationBase = void 0;
var instrumentation_1 = require("../../instrumentation");
/**
 * Base abstract class for instrumenting web plugins
 */

var InstrumentationBase = function (_instrumentation_1$In) {
    _inherits(InstrumentationBase, _instrumentation_1$In);

    function InstrumentationBase(instrumentationName, instrumentationVersion, config) {
        _classCallCheck(this, InstrumentationBase);

        var _this = _possibleConstructorReturn(this, (InstrumentationBase.__proto__ || Object.getPrototypeOf(InstrumentationBase)).call(this, instrumentationName, instrumentationVersion, config));

        if (_this._config.enabled) {
            _this.enable();
        }
        return _this;
    }

    return InstrumentationBase;
}(instrumentation_1.InstrumentationAbstract);

exports.InstrumentationBase = InstrumentationBase;
//# sourceMappingURL=instrumentation.js.map