'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PropagationAPI = undefined;

var _globalUtils = require('../internal/global-utils');

var _NoopTextMapPropagator = require('../propagation/NoopTextMapPropagator');

var _TextMapPropagator = require('../propagation/TextMapPropagator');

var _contextHelpers = require('../baggage/context-helpers');

var _utils = require('../baggage/utils');

var _diag = require('./diag');

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
var API_NAME = 'propagation';
var NOOP_TEXT_MAP_PROPAGATOR = new _NoopTextMapPropagator.NoopTextMapPropagator();
/**
 * Singleton object which represents the entry point to the OpenTelemetry Propagation API
 */
var PropagationAPI = /** @class */function () {
    /** Empty private constructor prevents end users from constructing a new instance of the API */
    function PropagationAPI() {
        this.createBaggage = _utils.createBaggage;
        this.getBaggage = _contextHelpers.getBaggage;
        this.getActiveBaggage = _contextHelpers.getActiveBaggage;
        this.setBaggage = _contextHelpers.setBaggage;
        this.deleteBaggage = _contextHelpers.deleteBaggage;
    }
    /** Get the singleton instance of the Propagator API */
    PropagationAPI.getInstance = function () {
        if (!this._instance) {
            this._instance = new PropagationAPI();
        }
        return this._instance;
    };
    /**
     * Set the current propagator.
     *
     * @returns true if the propagator was successfully registered, else false
     */
    PropagationAPI.prototype.setGlobalPropagator = function (propagator) {
        return (0, _globalUtils.registerGlobal)(API_NAME, propagator, _diag.DiagAPI.instance());
    };
    /**
     * Inject context into a carrier to be propagated inter-process
     *
     * @param context Context carrying tracing data to inject
     * @param carrier carrier to inject context into
     * @param setter Function used to set values on the carrier
     */
    PropagationAPI.prototype.inject = function (context, carrier, setter) {
        if (setter === void 0) {
            setter = _TextMapPropagator.defaultTextMapSetter;
        }
        return this._getGlobalPropagator().inject(context, carrier, setter);
    };
    /**
     * Extract context from a carrier
     *
     * @param context Context which the newly created context will inherit from
     * @param carrier Carrier to extract context from
     * @param getter Function used to extract keys from a carrier
     */
    PropagationAPI.prototype.extract = function (context, carrier, getter) {
        if (getter === void 0) {
            getter = _TextMapPropagator.defaultTextMapGetter;
        }
        return this._getGlobalPropagator().extract(context, carrier, getter);
    };
    /**
     * Return a list of all fields which may be used by the propagator.
     */
    PropagationAPI.prototype.fields = function () {
        return this._getGlobalPropagator().fields();
    };
    /** Remove the global propagator */
    PropagationAPI.prototype.disable = function () {
        (0, _globalUtils.unregisterGlobal)(API_NAME, _diag.DiagAPI.instance());
    };
    PropagationAPI.prototype._getGlobalPropagator = function () {
        return (0, _globalUtils.getGlobal)(API_NAME) || NOOP_TEXT_MAP_PROPAGATOR;
    };
    return PropagationAPI;
}();
exports.PropagationAPI = PropagationAPI;
//# sourceMappingURL=propagation.js.map