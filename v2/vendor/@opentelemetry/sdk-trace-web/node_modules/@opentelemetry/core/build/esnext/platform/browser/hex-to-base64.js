'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hexToBase64 = hexToBase64;

var _hexToBinary = require('../../common/hex-to-binary');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /*
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


function hexToBase64(hexStr) {
  return btoa(String.fromCharCode.apply(String, _toConsumableArray((0, _hexToBinary.hexToBinary)(hexStr))));
}
//# sourceMappingURL=hex-to-base64.js.map