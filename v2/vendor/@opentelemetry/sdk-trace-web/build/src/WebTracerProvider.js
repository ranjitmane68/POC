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

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
exports.WebTracerProvider = void 0;
var sdk_trace_base_1 = require("@opentelemetry/sdk-trace-base");
var StackContextManager_1 = require("./StackContextManager");
/**
 * This class represents a web tracer with {@link StackContextManager}
 */

var WebTracerProvider = function (_sdk_trace_base_1$Bas) {
    _inherits(WebTracerProvider, _sdk_trace_base_1$Bas);

    /**
     * Constructs a new Tracer instance.
     * @param config Web Tracer config
     */
    function WebTracerProvider() {
        var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, WebTracerProvider);

        var _this = _possibleConstructorReturn(this, (WebTracerProvider.__proto__ || Object.getPrototypeOf(WebTracerProvider)).call(this, config));

        if (config.contextManager) {
            throw 'contextManager should be defined in register method not in' + ' constructor';
        }
        if (config.propagator) {
            throw 'propagator should be defined in register method not in constructor';
        }
        return _this;
    }
    /**
     * Register this TracerProvider for use with the OpenTelemetry API.
     * Undefined values may be replaced with defaults, and
     * null values will be skipped.
     *
     * @param config Configuration object for SDK registration
     */


    _createClass(WebTracerProvider, [{
        key: "register",
        value: function register() {
            var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            if (config.contextManager === undefined) {
                config.contextManager = new StackContextManager_1.StackContextManager();
            }
            if (config.contextManager) {
                config.contextManager.enable();
            }
            _get(WebTracerProvider.prototype.__proto__ || Object.getPrototypeOf(WebTracerProvider.prototype), "register", this).call(this, config);
        }
    }]);

    return WebTracerProvider;
}(sdk_trace_base_1.BasicTracerProvider);

exports.WebTracerProvider = WebTracerProvider;
//# sourceMappingURL=WebTracerProvider.js.map