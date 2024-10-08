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
exports.ProxyTracer = void 0;
var NoopTracer_1 = require("./NoopTracer");
var NOOP_TRACER = new NoopTracer_1.NoopTracer();
/**
 * Proxy tracer provided by the proxy tracer provider
 */

var ProxyTracer = function () {
    function ProxyTracer(_provider, name, version, options) {
        _classCallCheck(this, ProxyTracer);

        this._provider = _provider;
        this.name = name;
        this.version = version;
        this.options = options;
    }

    _createClass(ProxyTracer, [{
        key: "startSpan",
        value: function startSpan(name, options, context) {
            return this._getTracer().startSpan(name, options, context);
        }
    }, {
        key: "startActiveSpan",
        value: function startActiveSpan(_name, _options, _context, _fn) {
            var tracer = this._getTracer();
            return Reflect.apply(tracer.startActiveSpan, tracer, arguments);
        }
        /**
         * Try to get a tracer from the proxy tracer provider.
         * If the proxy tracer provider has no delegate, return a noop tracer.
         */

    }, {
        key: "_getTracer",
        value: function _getTracer() {
            if (this._delegate) {
                return this._delegate;
            }
            var tracer = this._provider.getDelegateTracer(this.name, this.version, this.options);
            if (!tracer) {
                return NOOP_TRACER;
            }
            this._delegate = tracer;
            return this._delegate;
        }
    }]);

    return ProxyTracer;
}();

exports.ProxyTracer = ProxyTracer;
//# sourceMappingURL=ProxyTracer.js.map