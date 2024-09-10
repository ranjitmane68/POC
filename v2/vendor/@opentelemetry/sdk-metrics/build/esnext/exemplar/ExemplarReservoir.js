'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FixedSizeExemplarReservoirBase = undefined;

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


var _api = require('@opentelemetry/api');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ExemplarBucket = function () {
    function ExemplarBucket() {
        _classCallCheck(this, ExemplarBucket);

        this.value = 0;
        this.attributes = {};
        this.timestamp = [0, 0];
        this._offered = false;
    }

    _createClass(ExemplarBucket, [{
        key: 'offer',
        value: function offer(value, timestamp, attributes, ctx) {
            this.value = value;
            this.timestamp = timestamp;
            this.attributes = attributes;
            var spanContext = _api.trace.getSpanContext(ctx);
            if (spanContext && (0, _api.isSpanContextValid)(spanContext)) {
                this.spanId = spanContext.spanId;
                this.traceId = spanContext.traceId;
            }
            this._offered = true;
        }
    }, {
        key: 'collect',
        value: function collect(pointAttributes) {
            if (!this._offered) return null;
            var currentAttributes = this.attributes;
            // filter attributes
            Object.keys(pointAttributes).forEach(function (key) {
                if (pointAttributes[key] === currentAttributes[key]) {
                    delete currentAttributes[key];
                }
            });
            var retVal = {
                filteredAttributes: currentAttributes,
                value: this.value,
                timestamp: this.timestamp,
                spanId: this.spanId,
                traceId: this.traceId
            };
            this.attributes = {};
            this.value = 0;
            this.timestamp = [0, 0];
            this.spanId = undefined;
            this.traceId = undefined;
            this._offered = false;
            return retVal;
        }
    }]);

    return ExemplarBucket;
}();

var FixedSizeExemplarReservoirBase = exports.FixedSizeExemplarReservoirBase = function () {
    function FixedSizeExemplarReservoirBase(size) {
        _classCallCheck(this, FixedSizeExemplarReservoirBase);

        this._size = size;
        this._reservoirStorage = new Array(size);
        for (var i = 0; i < this._size; i++) {
            this._reservoirStorage[i] = new ExemplarBucket();
        }
    }

    _createClass(FixedSizeExemplarReservoirBase, [{
        key: 'maxSize',
        value: function maxSize() {
            return this._size;
        }
        /**
         * Resets the reservoir
         */

    }, {
        key: 'reset',
        value: function reset() {}
    }, {
        key: 'collect',
        value: function collect(pointAttributes) {
            var exemplars = [];
            this._reservoirStorage.forEach(function (storageItem) {
                var res = storageItem.collect(pointAttributes);
                if (res !== null) {
                    exemplars.push(res);
                }
            });
            this.reset();
            return exemplars;
        }
    }]);

    return FixedSizeExemplarReservoirBase;
}();
//# sourceMappingURL=ExemplarReservoir.js.map