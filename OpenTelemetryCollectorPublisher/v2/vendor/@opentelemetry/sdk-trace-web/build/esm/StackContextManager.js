"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.StackContextManager = undefined;

var _api = require("@opentelemetry/api");

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
var __read = undefined && undefined.__read || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o),
        r,
        ar = [],
        e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) {
            ar.push(r.value);
        }
    } catch (error) {
        e = { error: error };
    } finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        } finally {
            if (e) throw e.error;
        }
    }
    return ar;
};
var __spreadArray = undefined && undefined.__spreadArray || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};

/**
 * Stack Context Manager for managing the state in web
 * it doesn't fully support the async calls though
 */
var StackContextManager = /** @class */function () {
    function StackContextManager() {
        /**
         * whether the context manager is enabled or not
         */
        this._enabled = false;
        /**
         * Keeps the reference to current context
         */
        this._currentContext = _api.ROOT_CONTEXT;
    }
    /**
     *
     * @param context
     * @param target Function to be executed within the context
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    StackContextManager.prototype._bindFunction = function (context, target) {
        if (context === void 0) {
            context = _api.ROOT_CONTEXT;
        }
        var manager = this;
        var contextWrapper = function contextWrapper() {
            var _this = this;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
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
    };
    /**
     * Returns the active context
     */
    StackContextManager.prototype.active = function () {
        return this._currentContext;
    };
    /**
     * Binds a the certain context or the active one to the target function and then returns the target
     * @param context A context (span) to be bind to target
     * @param target a function or event emitter. When target or one of its callbacks is called,
     *  the provided context will be used as the active context for the duration of the call.
     */
    StackContextManager.prototype.bind = function (context, target) {
        // if no specific context to propagate is given, we use the current one
        if (context === undefined) {
            context = this.active();
        }
        if (typeof target === 'function') {
            return this._bindFunction(context, target);
        }
        return target;
    };
    /**
     * Disable the context manager (clears the current context)
     */
    StackContextManager.prototype.disable = function () {
        this._currentContext = _api.ROOT_CONTEXT;
        this._enabled = false;
        return this;
    };
    /**
     * Enables the context manager and creates a default(root) context
     */
    StackContextManager.prototype.enable = function () {
        if (this._enabled) {
            return this;
        }
        this._enabled = true;
        this._currentContext = _api.ROOT_CONTEXT;
        return this;
    };
    /**
     * Calls the callback function [fn] with the provided [context]. If [context] is undefined then it will use the window.
     * The context will be set as active
     * @param context
     * @param fn Callback function
     * @param thisArg optional receiver to be used for calling fn
     * @param args optional arguments forwarded to fn
     */
    StackContextManager.prototype.with = function (context, fn, thisArg) {
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args[_i - 3] = arguments[_i];
        }
        var previousContext = this._currentContext;
        this._currentContext = context || _api.ROOT_CONTEXT;
        try {
            return fn.call.apply(fn, __spreadArray([thisArg], __read(args), false));
        } finally {
            this._currentContext = previousContext;
        }
    };
    return StackContextManager;
}();
exports.StackContextManager = StackContextManager;
//# sourceMappingURL=StackContextManager.js.map