'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ContextAPI = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
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


var _NoopContextManager = require('../context/NoopContextManager');

var _globalUtils = require('../internal/global-utils');

var _diag = require('./diag');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var API_NAME = 'context';
var NOOP_CONTEXT_MANAGER = new _NoopContextManager.NoopContextManager();
/**
 * Singleton object which represents the entry point to the OpenTelemetry Context API
 */

var ContextAPI = exports.ContextAPI = function () {
    /** Empty private constructor prevents end users from constructing a new instance of the API */
    function ContextAPI() {
        _classCallCheck(this, ContextAPI);
    }
    /** Get the singleton instance of the Context API */


    _createClass(ContextAPI, [{
        key: 'setGlobalContextManager',

        /**
         * Set the current context manager.
         *
         * @returns true if the context manager was successfully registered, else false
         */
        value: function setGlobalContextManager(contextManager) {
            return (0, _globalUtils.registerGlobal)(API_NAME, contextManager, _diag.DiagAPI.instance());
        }
        /**
         * Get the currently active context
         */

    }, {
        key: 'active',
        value: function active() {
            return this._getContextManager().active();
        }
        /**
         * Execute a function with an active context
         *
         * @param context context to be active during function execution
         * @param fn function to execute in a context
         * @param thisArg optional receiver to be used for calling fn
         * @param args optional arguments forwarded to fn
         */

    }, {
        key: 'with',
        value: function _with(context, fn, thisArg) {
            var _getContextManager2;

            for (var _len = arguments.length, args = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
                args[_key - 3] = arguments[_key];
            }

            return (_getContextManager2 = this._getContextManager()).with.apply(_getContextManager2, [context, fn, thisArg].concat(args));
        }
        /**
         * Bind a context to a target function or event emitter
         *
         * @param context context to bind to the event emitter or function. Defaults to the currently active context
         * @param target function or event emitter to bind
         */

    }, {
        key: 'bind',
        value: function bind(context, target) {
            return this._getContextManager().bind(context, target);
        }
    }, {
        key: '_getContextManager',
        value: function _getContextManager() {
            return (0, _globalUtils.getGlobal)(API_NAME) || NOOP_CONTEXT_MANAGER;
        }
        /** Disable and remove the global context manager */

    }, {
        key: 'disable',
        value: function disable() {
            this._getContextManager().disable();
            (0, _globalUtils.unregisterGlobal)(API_NAME, _diag.DiagAPI.instance());
        }
    }], [{
        key: 'getInstance',
        value: function getInstance() {
            if (!this._instance) {
                this._instance = new ContextAPI();
            }
            return this._instance;
        }
    }]);

    return ContextAPI;
}();
//# sourceMappingURL=context.js.map