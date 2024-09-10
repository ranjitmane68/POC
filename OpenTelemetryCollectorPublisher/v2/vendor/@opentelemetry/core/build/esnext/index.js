'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.internal = exports.baggageUtils = undefined;

var _W3CBaggagePropagator = require('./baggage/propagation/W3CBaggagePropagator');

Object.keys(_W3CBaggagePropagator).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _W3CBaggagePropagator[key];
    }
  });
});

var _anchoredClock = require('./common/anchored-clock');

Object.keys(_anchoredClock).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _anchoredClock[key];
    }
  });
});

var _attributes = require('./common/attributes');

Object.keys(_attributes).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _attributes[key];
    }
  });
});

var _globalErrorHandler = require('./common/global-error-handler');

Object.keys(_globalErrorHandler).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _globalErrorHandler[key];
    }
  });
});

var _loggingErrorHandler = require('./common/logging-error-handler');

Object.keys(_loggingErrorHandler).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _loggingErrorHandler[key];
    }
  });
});

var _time = require('./common/time');

Object.keys(_time).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _time[key];
    }
  });
});

var _types = require('./common/types');

Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _types[key];
    }
  });
});

var _hexToBinary = require('./common/hex-to-binary');

Object.keys(_hexToBinary).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _hexToBinary[key];
    }
  });
});

var _ExportResult = require('./ExportResult');

Object.keys(_ExportResult).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _ExportResult[key];
    }
  });
});

var _platform = require('./platform');

Object.keys(_platform).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _platform[key];
    }
  });
});

var _composite = require('./propagation/composite');

Object.keys(_composite).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _composite[key];
    }
  });
});

var _W3CTraceContextPropagator = require('./trace/W3CTraceContextPropagator');

Object.keys(_W3CTraceContextPropagator).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _W3CTraceContextPropagator[key];
    }
  });
});

var _IdGenerator = require('./trace/IdGenerator');

Object.keys(_IdGenerator).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _IdGenerator[key];
    }
  });
});

var _rpcMetadata = require('./trace/rpc-metadata');

Object.keys(_rpcMetadata).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _rpcMetadata[key];
    }
  });
});

var _AlwaysOffSampler = require('./trace/sampler/AlwaysOffSampler');

Object.keys(_AlwaysOffSampler).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _AlwaysOffSampler[key];
    }
  });
});

var _AlwaysOnSampler = require('./trace/sampler/AlwaysOnSampler');

Object.keys(_AlwaysOnSampler).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _AlwaysOnSampler[key];
    }
  });
});

var _ParentBasedSampler = require('./trace/sampler/ParentBasedSampler');

Object.keys(_ParentBasedSampler).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _ParentBasedSampler[key];
    }
  });
});

var _TraceIdRatioBasedSampler = require('./trace/sampler/TraceIdRatioBasedSampler');

Object.keys(_TraceIdRatioBasedSampler).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _TraceIdRatioBasedSampler[key];
    }
  });
});

var _suppressTracing = require('./trace/suppress-tracing');

Object.keys(_suppressTracing).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _suppressTracing[key];
    }
  });
});

var _TraceState = require('./trace/TraceState');

Object.keys(_TraceState).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _TraceState[key];
    }
  });
});

var _environment = require('./utils/environment');

Object.keys(_environment).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _environment[key];
    }
  });
});

var _merge = require('./utils/merge');

Object.keys(_merge).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _merge[key];
    }
  });
});

var _sampling = require('./utils/sampling');

Object.keys(_sampling).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _sampling[key];
    }
  });
});

var _timeout = require('./utils/timeout');

Object.keys(_timeout).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _timeout[key];
    }
  });
});

var _url = require('./utils/url');

Object.keys(_url).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _url[key];
    }
  });
});

var _wrap = require('./utils/wrap');

Object.keys(_wrap).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _wrap[key];
    }
  });
});

var _callback = require('./utils/callback');

Object.keys(_callback).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _callback[key];
    }
  });
});

var _version = require('./version');

Object.keys(_version).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _version[key];
    }
  });
});

var _utils = require('./baggage/utils');

var _baggageUtils = _interopRequireWildcard(_utils);

var _exporter = require('./internal/exporter');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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
exports.baggageUtils = _baggageUtils;
var internal = exports.internal = {
  _export: _exporter._export
};
//# sourceMappingURL=index.js.map