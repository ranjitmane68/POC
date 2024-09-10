'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MeterProviderSharedState = undefined;

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


var _utils = require('../utils');

var _ViewRegistry = require('../view/ViewRegistry');

var _MeterSharedState = require('./MeterSharedState');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * An internal record for shared meter provider states.
 */
var MeterProviderSharedState = exports.MeterProviderSharedState = function () {
    function MeterProviderSharedState(resource) {
        _classCallCheck(this, MeterProviderSharedState);

        this.resource = resource;
        this.viewRegistry = new _ViewRegistry.ViewRegistry();
        this.metricCollectors = [];
        this.meterSharedStates = new Map();
    }

    _createClass(MeterProviderSharedState, [{
        key: 'getMeterSharedState',
        value: function getMeterSharedState(instrumentationScope) {
            var id = (0, _utils.instrumentationScopeId)(instrumentationScope);
            var meterSharedState = this.meterSharedStates.get(id);
            if (meterSharedState == null) {
                meterSharedState = new _MeterSharedState.MeterSharedState(this, instrumentationScope);
                this.meterSharedStates.set(id, meterSharedState);
            }
            return meterSharedState;
        }
    }, {
        key: 'selectAggregations',
        value: function selectAggregations(instrumentType) {
            var result = [];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.metricCollectors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var collector = _step.value;

                    result.push([collector, collector.selectAggregation(instrumentType)]);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return result;
        }
    }]);

    return MeterProviderSharedState;
}();
//# sourceMappingURL=MeterProviderSharedState.js.map