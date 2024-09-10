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
exports.ProxyTracerProvider = void 0;
var ProxyTracer_1 = require("./ProxyTracer");
var NoopTracerProvider_1 = require("./NoopTracerProvider");
var NOOP_TRACER_PROVIDER = new NoopTracerProvider_1.NoopTracerProvider();
/**
 * Tracer provider which provides {@link ProxyTracer}s.
 *
 * Before a delegate is set, tracers provided are NoOp.
 *   When a delegate is set, traces are provided from the delegate.
 *   When a delegate is set after tracers have already been provided,
 *   all tracers already provided will use the provided delegate implementation.
 */

var ProxyTracerProvider = function () {
    function ProxyTracerProvider() {
        _classCallCheck(this, ProxyTracerProvider);
    }

    _createClass(ProxyTracerProvider, [{
        key: "getTracer",

        /**
         * Get a {@link ProxyTracer}
         */
        value: function getTracer(name, version, options) {
            var _a;
            return (_a = this.getDelegateTracer(name, version, options)) !== null && _a !== void 0 ? _a : new ProxyTracer_1.ProxyTracer(this, name, version, options);
        }
    }, {
        key: "getDelegate",
        value: function getDelegate() {
            var _a;
            return (_a = this._delegate) !== null && _a !== void 0 ? _a : NOOP_TRACER_PROVIDER;
        }
        /**
         * Set the delegate tracer provider
         */

    }, {
        key: "setDelegate",
        value: function setDelegate(delegate) {
            this._delegate = delegate;
        }
    }, {
        key: "getDelegateTracer",
        value: function getDelegateTracer(name, version, options) {
            var _a;
            return (_a = this._delegate) === null || _a === void 0 ? void 0 : _a.getTracer(name, version, options);
        }
    }]);

    return ProxyTracerProvider;
}();

exports.ProxyTracerProvider = ProxyTracerProvider;
//# sourceMappingURL=ProxyTracerProvider.js.map