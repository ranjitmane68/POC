"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
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
var defaultTextMapGetter = exports.defaultTextMapGetter = {
    get: function get(carrier, key) {
        if (carrier == null) {
            return undefined;
        }
        return carrier[key];
    },
    keys: function keys(carrier) {
        if (carrier == null) {
            return [];
        }
        return Object.keys(carrier);
    }
};
var defaultTextMapSetter = exports.defaultTextMapSetter = {
    set: function set(carrier, key, value) {
        if (carrier == null) {
            return;
        }
        carrier[key] = value;
    }
};
//# sourceMappingURL=TextMapPropagator.js.map