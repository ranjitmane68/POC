"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.WebTracerProvider = undefined;

var _sdkTraceBase = require("@opentelemetry/sdk-trace-base");

var _StackContextManager = require("./StackContextManager");

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
var __extends = undefined && undefined.__extends || function () {
    var _extendStatics = function extendStatics(d, b) {
        _extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) {
                if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
            }
        };
        return _extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        _extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();

/**
 * This class represents a web tracer with {@link StackContextManager}
 */
var WebTracerProvider = /** @class */function (_super) {
    __extends(WebTracerProvider, _super);
    /**
     * Constructs a new Tracer instance.
     * @param config Web Tracer config
     */
    function WebTracerProvider(config) {
        if (config === void 0) {
            config = {};
        }
        var _this = _super.call(this, config) || this;
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
    WebTracerProvider.prototype.register = function (config) {
        if (config === void 0) {
            config = {};
        }
        if (config.contextManager === undefined) {
            config.contextManager = new _StackContextManager.StackContextManager();
        }
        if (config.contextManager) {
            config.contextManager.enable();
        }
        _super.prototype.register.call(this, config);
    };
    return WebTracerProvider;
}(_sdkTraceBase.BasicTracerProvider);
exports.WebTracerProvider = WebTracerProvider;
//# sourceMappingURL=WebTracerProvider.js.map