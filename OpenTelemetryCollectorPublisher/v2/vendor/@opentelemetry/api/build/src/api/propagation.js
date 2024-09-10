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
exports.PropagationAPI = void 0;
var global_utils_1 = require("../internal/global-utils");
var NoopTextMapPropagator_1 = require("../propagation/NoopTextMapPropagator");
var TextMapPropagator_1 = require("../propagation/TextMapPropagator");
var context_helpers_1 = require("../baggage/context-helpers");
var utils_1 = require("../baggage/utils");
var diag_1 = require("./diag");
var API_NAME = 'propagation';
var NOOP_TEXT_MAP_PROPAGATOR = new NoopTextMapPropagator_1.NoopTextMapPropagator();
/**
 * Singleton object which represents the entry point to the OpenTelemetry Propagation API
 */

var PropagationAPI = function () {
    /** Empty private constructor prevents end users from constructing a new instance of the API */
    function PropagationAPI() {
        _classCallCheck(this, PropagationAPI);

        this.createBaggage = utils_1.createBaggage;
        this.getBaggage = context_helpers_1.getBaggage;
        this.getActiveBaggage = context_helpers_1.getActiveBaggage;
        this.setBaggage = context_helpers_1.setBaggage;
        this.deleteBaggage = context_helpers_1.deleteBaggage;
    }
    /** Get the singleton instance of the Propagator API */


    _createClass(PropagationAPI, [{
        key: "setGlobalPropagator",

        /**
         * Set the current propagator.
         *
         * @returns true if the propagator was successfully registered, else false
         */
        value: function setGlobalPropagator(propagator) {
            return (0, global_utils_1.registerGlobal)(API_NAME, propagator, diag_1.DiagAPI.instance());
        }
        /**
         * Inject context into a carrier to be propagated inter-process
         *
         * @param context Context carrying tracing data to inject
         * @param carrier carrier to inject context into
         * @param setter Function used to set values on the carrier
         */

    }, {
        key: "inject",
        value: function inject(context, carrier) {
            var setter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : TextMapPropagator_1.defaultTextMapSetter;

            return this._getGlobalPropagator().inject(context, carrier, setter);
        }
        /**
         * Extract context from a carrier
         *
         * @param context Context which the newly created context will inherit from
         * @param carrier Carrier to extract context from
         * @param getter Function used to extract keys from a carrier
         */

    }, {
        key: "extract",
        value: function extract(context, carrier) {
            var getter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : TextMapPropagator_1.defaultTextMapGetter;

            return this._getGlobalPropagator().extract(context, carrier, getter);
        }
        /**
         * Return a list of all fields which may be used by the propagator.
         */

    }, {
        key: "fields",
        value: function fields() {
            return this._getGlobalPropagator().fields();
        }
        /** Remove the global propagator */

    }, {
        key: "disable",
        value: function disable() {
            (0, global_utils_1.unregisterGlobal)(API_NAME, diag_1.DiagAPI.instance());
        }
    }, {
        key: "_getGlobalPropagator",
        value: function _getGlobalPropagator() {
            return (0, global_utils_1.getGlobal)(API_NAME) || NOOP_TEXT_MAP_PROPAGATOR;
        }
    }], [{
        key: "getInstance",
        value: function getInstance() {
            if (!this._instance) {
                this._instance = new PropagationAPI();
            }
            return this._instance;
        }
    }]);

    return PropagationAPI;
}();

exports.PropagationAPI = PropagationAPI;
//# sourceMappingURL=propagation.js.map