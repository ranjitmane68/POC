'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.trace = exports.propagation = exports.metrics = exports.diag = exports.context = exports.INVALID_SPAN_CONTEXT = exports.INVALID_TRACEID = exports.INVALID_SPANID = exports.isValidSpanId = exports.isValidTraceId = exports.isSpanContextValid = exports.createTraceState = exports.TraceFlags = exports.SpanStatusCode = exports.SpanKind = exports.SamplingDecision = exports.ProxyTracerProvider = exports.ProxyTracer = exports.defaultTextMapSetter = exports.defaultTextMapGetter = exports.ValueType = exports.createNoopMeter = exports.DiagLogLevel = exports.DiagConsoleLogger = exports.ROOT_CONTEXT = exports.createContextKey = exports.baggageEntryMetadataFromString = undefined;

var _utils = require('./baggage/utils');

Object.defineProperty(exports, 'baggageEntryMetadataFromString', {
  enumerable: true,
  get: function get() {
    return _utils.baggageEntryMetadataFromString;
  }
});

var _context = require('./context/context');

Object.defineProperty(exports, 'createContextKey', {
  enumerable: true,
  get: function get() {
    return _context.createContextKey;
  }
});
Object.defineProperty(exports, 'ROOT_CONTEXT', {
  enumerable: true,
  get: function get() {
    return _context.ROOT_CONTEXT;
  }
});

var _consoleLogger = require('./diag/consoleLogger');

Object.defineProperty(exports, 'DiagConsoleLogger', {
  enumerable: true,
  get: function get() {
    return _consoleLogger.DiagConsoleLogger;
  }
});

var _types = require('./diag/types');

Object.defineProperty(exports, 'DiagLogLevel', {
  enumerable: true,
  get: function get() {
    return _types.DiagLogLevel;
  }
});

var _NoopMeter = require('./metrics/NoopMeter');

Object.defineProperty(exports, 'createNoopMeter', {
  enumerable: true,
  get: function get() {
    return _NoopMeter.createNoopMeter;
  }
});

var _Metric = require('./metrics/Metric');

Object.defineProperty(exports, 'ValueType', {
  enumerable: true,
  get: function get() {
    return _Metric.ValueType;
  }
});

var _TextMapPropagator = require('./propagation/TextMapPropagator');

Object.defineProperty(exports, 'defaultTextMapGetter', {
  enumerable: true,
  get: function get() {
    return _TextMapPropagator.defaultTextMapGetter;
  }
});
Object.defineProperty(exports, 'defaultTextMapSetter', {
  enumerable: true,
  get: function get() {
    return _TextMapPropagator.defaultTextMapSetter;
  }
});

var _ProxyTracer = require('./trace/ProxyTracer');

Object.defineProperty(exports, 'ProxyTracer', {
  enumerable: true,
  get: function get() {
    return _ProxyTracer.ProxyTracer;
  }
});

var _ProxyTracerProvider = require('./trace/ProxyTracerProvider');

Object.defineProperty(exports, 'ProxyTracerProvider', {
  enumerable: true,
  get: function get() {
    return _ProxyTracerProvider.ProxyTracerProvider;
  }
});

var _SamplingResult = require('./trace/SamplingResult');

Object.defineProperty(exports, 'SamplingDecision', {
  enumerable: true,
  get: function get() {
    return _SamplingResult.SamplingDecision;
  }
});

var _span_kind = require('./trace/span_kind');

Object.defineProperty(exports, 'SpanKind', {
  enumerable: true,
  get: function get() {
    return _span_kind.SpanKind;
  }
});

var _status = require('./trace/status');

Object.defineProperty(exports, 'SpanStatusCode', {
  enumerable: true,
  get: function get() {
    return _status.SpanStatusCode;
  }
});

var _trace_flags = require('./trace/trace_flags');

Object.defineProperty(exports, 'TraceFlags', {
  enumerable: true,
  get: function get() {
    return _trace_flags.TraceFlags;
  }
});

var _utils2 = require('./trace/internal/utils');

Object.defineProperty(exports, 'createTraceState', {
  enumerable: true,
  get: function get() {
    return _utils2.createTraceState;
  }
});

var _spancontextUtils = require('./trace/spancontext-utils');

Object.defineProperty(exports, 'isSpanContextValid', {
  enumerable: true,
  get: function get() {
    return _spancontextUtils.isSpanContextValid;
  }
});
Object.defineProperty(exports, 'isValidTraceId', {
  enumerable: true,
  get: function get() {
    return _spancontextUtils.isValidTraceId;
  }
});
Object.defineProperty(exports, 'isValidSpanId', {
  enumerable: true,
  get: function get() {
    return _spancontextUtils.isValidSpanId;
  }
});

var _invalidSpanConstants = require('./trace/invalid-span-constants');

Object.defineProperty(exports, 'INVALID_SPANID', {
  enumerable: true,
  get: function get() {
    return _invalidSpanConstants.INVALID_SPANID;
  }
});
Object.defineProperty(exports, 'INVALID_TRACEID', {
  enumerable: true,
  get: function get() {
    return _invalidSpanConstants.INVALID_TRACEID;
  }
});
Object.defineProperty(exports, 'INVALID_SPAN_CONTEXT', {
  enumerable: true,
  get: function get() {
    return _invalidSpanConstants.INVALID_SPAN_CONTEXT;
  }
});

var _contextApi = require('./context-api');

var _diagApi = require('./diag-api');

var _metricsApi = require('./metrics-api');

var _propagationApi = require('./propagation-api');

var _traceApi = require('./trace-api');

// Named export.
exports.context = _contextApi.context;
exports.diag = _diagApi.diag;
exports.metrics = _metricsApi.metrics;
exports.propagation = _propagationApi.propagation;
exports.trace = _traceApi.trace;
// Default export.

// Split module-level variable definition into separate files to allow
// tree-shaking on each api instance.

exports.default = {
  context: _contextApi.context,
  diag: _diagApi.diag,
  metrics: _metricsApi.metrics,
  propagation: _propagationApi.propagation,
  trace: _traceApi.trace
};
//# sourceMappingURL=index.js.map