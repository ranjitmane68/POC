'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ZoneContextManager = undefined;

var _api = require('@opentelemetry/api');

var _util = require('./util');

/* Key name to be used to save a context reference in Zone */
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
/// <reference types="zone.js" />
var ZONE_CONTEXT_KEY = 'OT_ZONE_CONTEXT';
/**
 * ZoneContextManager
 * This module provides an easy functionality for tracing action between asynchronous operations in web.
 * It was not possible with standard [StackContextManager]{@link https://github.com/open-telemetry/opentelemetry-js/blob/main/packages/opentelemetry-sdk-trace-web/src/StackContextManager.ts}.
 * It heavily depends on [zone.js]{@link https://www.npmjs.com/package/zone.js}.
 * It stores the information about context in zone. Each Context will have always new Zone;
 * It also supports binding a certain Span to a target that has "addEventListener" and "removeEventListener".
 * When this happens a new zone is being created and the provided Span is being assigned to this zone.
 */
var ZoneContextManager = /** @class */function () {
    function ZoneContextManager() {
        /**
         * whether the context manager is enabled or not
         */
        this._enabled = false;
        /**
         * Helps to create a unique name for the zones - part of zone name
         */
        this._zoneCounter = 0;
    }
    /**
     * Returns the active context from certain zone name
     * @param activeZone
     */
    ZoneContextManager.prototype._activeContextFromZone = function (activeZone) {
        return activeZone && activeZone.get(ZONE_CONTEXT_KEY) || _api.ROOT_CONTEXT;
    };
    /**
     * @param context A context (span) to be executed within target function
     * @param target Function to be executed within the context
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    ZoneContextManager.prototype._bindFunction = function (context, target) {
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
     * @param context A context (span) to be bind to target
     * @param obj target object on which the listeners will be patched
     */
    ZoneContextManager.prototype._bindListener = function (context, obj) {
        var target = obj;
        if (target.__ot_listeners !== undefined) {
            return obj;
        }
        target.__ot_listeners = {};
        if (typeof target.addEventListener === 'function') {
            target.addEventListener = this._patchAddEventListener(target, target.addEventListener, context);
        }
        if (typeof target.removeEventListener === 'function') {
            target.removeEventListener = this._patchRemoveEventListener(target, target.removeEventListener);
        }
        return obj;
    };
    /**
     * Creates a new unique zone name
     */
    ZoneContextManager.prototype._createZoneName = function () {
        this._zoneCounter++;
        var random = Math.random();
        return this._zoneCounter + "-" + random;
    };
    /**
     * Creates a new zone
     * @param zoneName zone name
     * @param context A context (span) to be bind with Zone
     */
    ZoneContextManager.prototype._createZone = function (zoneName, context) {
        var _a;
        return Zone.current.fork({
            name: zoneName,
            properties: (_a = {}, _a[ZONE_CONTEXT_KEY] = context, _a)
        });
    };
    /**
     * Returns the active zone
     */
    ZoneContextManager.prototype._getActiveZone = function () {
        return Zone.current;
    };
    /**
     * Patches addEventListener method
     * @param target any target that has "addEventListener" method
     * @param original reference to the patched method
     * @param [context] context to be bind to the listener
     */
    ZoneContextManager.prototype._patchAddEventListener = function (target, original, context) {
        var contextManager = this;
        return function (event, listener, opts) {
            if (target.__ot_listeners === undefined) {
                target.__ot_listeners = {};
            }
            var listeners = target.__ot_listeners[event];
            if (listeners === undefined) {
                listeners = new WeakMap();
                target.__ot_listeners[event] = listeners;
            }
            var patchedListener = contextManager.bind(context, listener);
            // store a weak reference of the user listener to ours
            listeners.set(listener, patchedListener);
            return original.call(this, event, patchedListener, opts);
        };
    };
    /**
     * Patches removeEventListener method
     * @param target any target that has "removeEventListener" method
     * @param original reference to the patched method
     */
    ZoneContextManager.prototype._patchRemoveEventListener = function (target, original) {
        return function (event, listener) {
            if (target.__ot_listeners === undefined || target.__ot_listeners[event] === undefined) {
                return original.call(this, event, listener);
            }
            var events = target.__ot_listeners[event];
            var patchedListener = events.get(listener);
            events.delete(listener);
            return original.call(this, event, patchedListener || listener);
        };
    };
    /**
     * Returns the active context
     */
    ZoneContextManager.prototype.active = function () {
        if (!this._enabled) {
            return _api.ROOT_CONTEXT;
        }
        var activeZone = this._getActiveZone();
        var active = this._activeContextFromZone(activeZone);
        if (active) {
            return active;
        }
        return _api.ROOT_CONTEXT;
    };
    /**
     * Binds a the certain context or the active one to the target function and then returns the target
     * @param context A context (span) to be bind to target
     * @param target a function or event emitter. When target or one of its callbacks is called,
     *  the provided context will be used as the active context for the duration of the call.
     */
    ZoneContextManager.prototype.bind = function (context, target) {
        // if no specific context to propagate is given, we use the current one
        if (context === undefined) {
            context = this.active();
        }
        if (typeof target === 'function') {
            return this._bindFunction(context, target);
        } else if ((0, _util.isListenerObject)(target)) {
            this._bindListener(context, target);
        }
        return target;
    };
    /**
     * Disable the context manager (clears all the contexts)
     */
    ZoneContextManager.prototype.disable = function () {
        this._enabled = false;
        return this;
    };
    /**
     * Enables the context manager and creates a default(root) context
     */
    ZoneContextManager.prototype.enable = function () {
        this._enabled = true;
        return this;
    };
    /**
     * Calls the callback function [fn] with the provided [context].
     *     If [context] is undefined then it will use the active context.
     *     The context will be set as active
     * @param context A context (span) to be called with provided callback
     * @param fn Callback function
     * @param thisArg optional receiver to be used for calling fn
     * @param args optional arguments forwarded to fn
     */
    ZoneContextManager.prototype.with = function (context, fn, thisArg) {
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args[_i - 3] = arguments[_i];
        }
        var zoneName = this._createZoneName();
        var newZone = this._createZone(zoneName, context);
        return newZone.run(fn, thisArg, args);
    };
    return ZoneContextManager;
}();
exports.ZoneContextManager = ZoneContextManager;
//# sourceMappingURL=ZoneContextManager.js.map