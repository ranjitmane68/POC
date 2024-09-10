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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomIdGenerator = void 0;
var SPAN_ID_BYTES = 8;
var TRACE_ID_BYTES = 16;

var RandomIdGenerator = function RandomIdGenerator() {
    _classCallCheck(this, RandomIdGenerator);

    /**
     * Returns a random 16-byte trace ID formatted/encoded as a 32 lowercase hex
     * characters corresponding to 128 bits.
     */
    this.generateTraceId = getIdGenerator(TRACE_ID_BYTES);
    /**
     * Returns a random 8-byte span ID formatted/encoded as a 16 lowercase hex
     * characters corresponding to 64 bits.
     */
    this.generateSpanId = getIdGenerator(SPAN_ID_BYTES);
};

exports.RandomIdGenerator = RandomIdGenerator;
var SHARED_BUFFER = Buffer.allocUnsafe(TRACE_ID_BYTES);
function getIdGenerator(bytes) {
    return function generateId() {
        for (var i = 0; i < bytes / 4; i++) {
            // unsigned right shift drops decimal part of the number
            // it is required because if a number between 2**32 and 2**32 - 1 is generated, an out of range error is thrown by writeUInt32BE
            SHARED_BUFFER.writeUInt32BE(Math.random() * Math.pow(2, 32) >>> 0, i * 4);
        }
        // If buffer is all 0, set the last byte to 1 to guarantee a valid w3c id is generated
        for (var _i = 0; _i < bytes; _i++) {
            if (SHARED_BUFFER[_i] > 0) {
                break;
            } else if (_i === bytes - 1) {
                SHARED_BUFFER[bytes - 1] = 1;
            }
        }
        return SHARED_BUFFER.toString('hex', 0, bytes);
    };
}
//# sourceMappingURL=RandomIdGenerator.js.map