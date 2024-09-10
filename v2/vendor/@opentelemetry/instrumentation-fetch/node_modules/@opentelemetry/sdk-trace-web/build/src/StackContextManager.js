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
exports.StackContextManager = void 0;
var api_1 = require("@opentelemetry/api");
/**
 * Stack Context Manager for managing the state in web
 * it doesn't fully support the async calls though
 */

var StackContextManager = function () {
    function StackContextManager() {
        _classCallCheck(this, StackContextManager);

        /**
         * whether the context manager is enabled or not
         */
        this._enabled = false;
        /**
         * Keeps the reference to current context
         */
        this._currentContext = api_1.ROOT_CONTEXT;
    }
    /**
     *
     * @param context
     * @param target Function to be executed within the context
     */
    // eslint-disable-next-line @typescript-eslint/ban-types


    _createClass(StackContextManager, [{
        key: "_bindFunction",
        value: function _bindFunction() {
            var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : api_1.ROOT_CONTEXT;
            var target = arguments[1];

            var manager = this;
            var contextWrapper = function contextWrapper() {
                var _this = this;

                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                return manager.with(context, function () {
                    return target.apply(_this, args);
                });
            };
            Object.defineProperty(contextWrapper, 'length', {
                enumerable: false,
                configurable: true,
                writable: false,
                value: target.length
            });
            return contextWrapper;
        }
        /**
         * Returns the active context
         */

    }, {
        key: "active",
        value: function active() {
            return this._currentContext;
        }
        /**
         * Binds a the certain context or the active one to the target function and then returns the target
         * @param context A context (span) to be bind to target
         * @param target a function or event emitter. When target or one of its callbacks is called,
         *  the provided context will be used as the active context for the duration of the call.
         */

    }, {
        key: "bind",
        value: function bind(context, target) {
            // if no specific context to propagate is given, we use the current one
            if (context === undefined) {
                context = this.active();
            }
            if (typeof target === 'function') {
                return this._bindFunction(context, target);
            }
            return target;
        }
        /**
         * Disable the context manager (clears the current context)
         */

    }, {
        key: "disable",
        value: function disable() {
            this._currentContext = api_1.ROOT_CONTEXT;
            this._enabled = false;
            return this;
        }
        /**
         * Enables the context manager and creates a default(root) context
         */

    }, {
        key: "enable",
        value: function enable() {
            if (this._enabled) {
                return this;
            }
            this._enabled = true;
            this._currentContext = api_1.ROOT_CONTEXT;
            return this;
        }
        /**
         * Calls the callback function [fn] with the provided [context]. If [context] is undefined then it will use the window.
         * The context will be set as active
         * @param context
         * @param fn Callback function
         * @param thisArg optional receiver to be used for calling fn
         * @param args optional arguments forwarded to fn
         */

    }, {
        key: "with",
        value: function _with(context, fn, thisArg) {
            var previousContext = this._currentContext;
            this._currentContext = context || api_1.ROOT_CONTEXT;
            try {
                for (var _len2 = arguments.length, args = Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
                    args[_key2 - 3] = arguments[_key2];
                }

                return fn.call.apply(fn, [thisArg].concat(args));
            } finally {
                this._currentContext = previousContext;
            }
        }
    }]);

    return StackContextManager;
}();

exports.StackContextManager = StackContextManager;
//# sourceMappingURL=StackContextManager.js.map