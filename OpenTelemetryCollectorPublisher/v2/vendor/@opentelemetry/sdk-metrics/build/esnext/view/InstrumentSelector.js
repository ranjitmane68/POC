'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.InstrumentSelector = undefined;

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


var _Predicate = require('./Predicate');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var InstrumentSelector = exports.InstrumentSelector = function () {
    function InstrumentSelector(criteria) {
        _classCallCheck(this, InstrumentSelector);

        var _a;
        this._nameFilter = new _Predicate.PatternPredicate((_a = criteria === null || criteria === void 0 ? void 0 : criteria.name) !== null && _a !== void 0 ? _a : '*');
        this._type = criteria === null || criteria === void 0 ? void 0 : criteria.type;
        this._unitFilter = new _Predicate.ExactPredicate(criteria === null || criteria === void 0 ? void 0 : criteria.unit);
    }

    _createClass(InstrumentSelector, [{
        key: 'getType',
        value: function getType() {
            return this._type;
        }
    }, {
        key: 'getNameFilter',
        value: function getNameFilter() {
            return this._nameFilter;
        }
    }, {
        key: 'getUnitFilter',
        value: function getUnitFilter() {
            return this._unitFilter;
        }
    }]);

    return InstrumentSelector;
}();
//# sourceMappingURL=InstrumentSelector.js.map