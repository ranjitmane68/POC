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

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
exports.DeltaMetricProcessor = void 0;
var HashMap_1 = require("./HashMap");
/**
 * Internal interface.
 *
 * Allows synchronous collection of metrics. This processor should allow
 * allocation of new aggregation cells for metrics and convert cumulative
 * recording to delta data points.
 */

var DeltaMetricProcessor = function () {
    function DeltaMetricProcessor(_aggregator) {
        _classCallCheck(this, DeltaMetricProcessor);

        this._aggregator = _aggregator;
        this._activeCollectionStorage = new HashMap_1.AttributeHashMap();
        // TODO: find a reasonable mean to clean the memo;
        // https://github.com/open-telemetry/opentelemetry-specification/pull/2208
        this._cumulativeMemoStorage = new HashMap_1.AttributeHashMap();
    }

    _createClass(DeltaMetricProcessor, [{
        key: "record",
        value: function record(value, attributes, _context, collectionTime) {
            var _this = this;

            var accumulation = this._activeCollectionStorage.getOrDefault(attributes, function () {
                return _this._aggregator.createAccumulation(collectionTime);
            });
            accumulation === null || accumulation === void 0 ? void 0 : accumulation.record(value);
        }
    }, {
        key: "batchCumulate",
        value: function batchCumulate(measurements, collectionTime) {
            var _this2 = this;

            Array.from(measurements.entries()).forEach(function (_ref) {
                var _ref2 = _slicedToArray(_ref, 3),
                    attributes = _ref2[0],
                    value = _ref2[1],
                    hashCode = _ref2[2];

                var accumulation = _this2._aggregator.createAccumulation(collectionTime);
                accumulation === null || accumulation === void 0 ? void 0 : accumulation.record(value);
                var delta = accumulation;
                // Diff with recorded cumulative memo.
                if (_this2._cumulativeMemoStorage.has(attributes, hashCode)) {
                    // has() returned true, previous is present.
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    var previous = _this2._cumulativeMemoStorage.get(attributes, hashCode);
                    delta = _this2._aggregator.diff(previous, accumulation);
                }
                // Merge with uncollected active delta.
                if (_this2._activeCollectionStorage.has(attributes, hashCode)) {
                    // has() returned true, previous is present.
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    var active = _this2._activeCollectionStorage.get(attributes, hashCode);
                    delta = _this2._aggregator.merge(active, delta);
                }
                // Save the current record and the delta record.
                _this2._cumulativeMemoStorage.set(attributes, accumulation, hashCode);
                _this2._activeCollectionStorage.set(attributes, delta, hashCode);
            });
        }
        /**
         * Returns a collection of delta metrics. Start time is the when first
         * time event collected.
         */

    }, {
        key: "collect",
        value: function collect() {
            var unreportedDelta = this._activeCollectionStorage;
            this._activeCollectionStorage = new HashMap_1.AttributeHashMap();
            return unreportedDelta;
        }
    }]);

    return DeltaMetricProcessor;
}();

exports.DeltaMetricProcessor = DeltaMetricProcessor;
//# sourceMappingURL=DeltaMetricProcessor.js.map