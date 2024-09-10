"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
var ViewRegistry = exports.ViewRegistry = function () {
    function ViewRegistry() {
        _classCallCheck(this, ViewRegistry);

        this._registeredViews = [];
    }

    _createClass(ViewRegistry, [{
        key: "addView",
        value: function addView(view) {
            this._registeredViews.push(view);
        }
    }, {
        key: "findViews",
        value: function findViews(instrument, meter) {
            var _this = this;

            var views = this._registeredViews.filter(function (registeredView) {
                return _this._matchInstrument(registeredView.instrumentSelector, instrument) && _this._matchMeter(registeredView.meterSelector, meter);
            });
            return views;
        }
    }, {
        key: "_matchInstrument",
        value: function _matchInstrument(selector, instrument) {
            return (selector.getType() === undefined || instrument.type === selector.getType()) && selector.getNameFilter().match(instrument.name) && selector.getUnitFilter().match(instrument.unit);
        }
    }, {
        key: "_matchMeter",
        value: function _matchMeter(selector, meter) {
            return selector.getNameFilter().match(meter.name) && (meter.version === undefined || selector.getVersionFilter().match(meter.version)) && (meter.schemaUrl === undefined || selector.getSchemaUrlFilter().match(meter.schemaUrl));
        }
    }]);

    return ViewRegistry;
}();
//# sourceMappingURL=ViewRegistry.js.map