'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _instrumentation = require('./instrumentation');

Object.defineProperty(exports, 'InstrumentationBase', {
  enumerable: true,
  get: function get() {
    return _instrumentation.InstrumentationBase;
  }
});

var _noopNormalize = require('./noop-normalize');

Object.defineProperty(exports, 'normalize', {
  enumerable: true,
  get: function get() {
    return _noopNormalize.normalize;
  }
});