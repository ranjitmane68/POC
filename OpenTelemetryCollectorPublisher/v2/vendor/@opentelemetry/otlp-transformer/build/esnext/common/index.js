'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.hrTimeToNanos = hrTimeToNanos;
exports.toLongBits = toLongBits;
exports.encodeAsLongBits = encodeAsLongBits;
exports.encodeAsString = encodeAsString;
exports.getOtlpEncoder = getOtlpEncoder;

var _core = require('@opentelemetry/core');

function hrTimeToNanos(hrTime) {
    var NANOSECONDS = BigInt(1000000000);
    return BigInt(hrTime[0]) * NANOSECONDS + BigInt(hrTime[1]);
} /*
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
function toLongBits(value) {
    var low = Number(BigInt.asUintN(32, value));
    var high = Number(BigInt.asUintN(32, value >> BigInt(32)));
    return { low: low, high: high };
}
function encodeAsLongBits(hrTime) {
    var nanos = hrTimeToNanos(hrTime);
    return toLongBits(nanos);
}
function encodeAsString(hrTime) {
    var nanos = hrTimeToNanos(hrTime);
    return nanos.toString();
}
var encodeTimestamp = typeof BigInt !== 'undefined' ? encodeAsString : _core.hrTimeToNanoseconds;
function identity(value) {
    return value;
}
function optionalHexToBinary(str) {
    if (str === undefined) return undefined;
    return (0, _core.hexToBinary)(str);
}
var DEFAULT_ENCODER = {
    encodeHrTime: encodeAsLongBits,
    encodeSpanContext: _core.hexToBinary,
    encodeOptionalSpanContext: optionalHexToBinary
};
function getOtlpEncoder(options) {
    var _a, _b;
    if (options === undefined) {
        return DEFAULT_ENCODER;
    }
    var useLongBits = (_a = options.useLongBits) !== null && _a !== void 0 ? _a : true;
    var useHex = (_b = options.useHex) !== null && _b !== void 0 ? _b : false;
    return {
        encodeHrTime: useLongBits ? encodeAsLongBits : encodeTimestamp,
        encodeSpanContext: useHex ? identity : _core.hexToBinary,
        encodeOptionalSpanContext: useHex ? identity : optionalHexToBinary
    };
}
//# sourceMappingURL=index.js.map