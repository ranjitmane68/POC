'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TraceStateImpl = undefined;

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


var _tracestateValidators = require('./tracestate-validators');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MAX_TRACE_STATE_ITEMS = 32;
var MAX_TRACE_STATE_LEN = 512;
var LIST_MEMBERS_SEPARATOR = ',';
var LIST_MEMBER_KEY_VALUE_SPLITTER = '=';
/**
 * TraceState must be a class and not a simple object type because of the spec
 * requirement (https://www.w3.org/TR/trace-context/#tracestate-field).
 *
 * Here is the list of allowed mutations:
 * - New key-value pair should be added into the beginning of the list
 * - The value of any key can be updated. Modified keys MUST be moved to the
 * beginning of the list.
 */

var TraceStateImpl = exports.TraceStateImpl = function () {
    function TraceStateImpl(rawTraceState) {
        _classCallCheck(this, TraceStateImpl);

        this._internalState = new Map();
        if (rawTraceState) this._parse(rawTraceState);
    }

    _createClass(TraceStateImpl, [{
        key: 'set',
        value: function set(key, value) {
            // TODO: Benchmark the different approaches(map vs list) and
            // use the faster one.
            var traceState = this._clone();
            if (traceState._internalState.has(key)) {
                traceState._internalState.delete(key);
            }
            traceState._internalState.set(key, value);
            return traceState;
        }
    }, {
        key: 'unset',
        value: function unset(key) {
            var traceState = this._clone();
            traceState._internalState.delete(key);
            return traceState;
        }
    }, {
        key: 'get',
        value: function get(key) {
            return this._internalState.get(key);
        }
    }, {
        key: 'serialize',
        value: function serialize() {
            var _this = this;

            return this._keys().reduce(function (agg, key) {
                agg.push(key + LIST_MEMBER_KEY_VALUE_SPLITTER + _this.get(key));
                return agg;
            }, []).join(LIST_MEMBERS_SEPARATOR);
        }
    }, {
        key: '_parse',
        value: function _parse(rawTraceState) {
            if (rawTraceState.length > MAX_TRACE_STATE_LEN) return;
            this._internalState = rawTraceState.split(LIST_MEMBERS_SEPARATOR).reverse() // Store in reverse so new keys (.set(...)) will be placed at the beginning
            .reduce(function (agg, part) {
                var listMember = part.trim(); // Optional Whitespace (OWS) handling
                var i = listMember.indexOf(LIST_MEMBER_KEY_VALUE_SPLITTER);
                if (i !== -1) {
                    var key = listMember.slice(0, i);
                    var value = listMember.slice(i + 1, part.length);
                    if ((0, _tracestateValidators.validateKey)(key) && (0, _tracestateValidators.validateValue)(value)) {
                        agg.set(key, value);
                    } else {
                        // TODO: Consider to add warning log
                    }
                }
                return agg;
            }, new Map());
            // Because of the reverse() requirement, trunc must be done after map is created
            if (this._internalState.size > MAX_TRACE_STATE_ITEMS) {
                this._internalState = new Map(Array.from(this._internalState.entries()).reverse() // Use reverse same as original tracestate parse chain
                .slice(0, MAX_TRACE_STATE_ITEMS));
            }
        }
    }, {
        key: '_keys',
        value: function _keys() {
            return Array.from(this._internalState.keys()).reverse();
        }
    }, {
        key: '_clone',
        value: function _clone() {
            var traceState = new TraceStateImpl();
            traceState._internalState = new Map(this._internalState);
            return traceState;
        }
    }]);

    return TraceStateImpl;
}();
//# sourceMappingURL=tracestate-impl.js.map