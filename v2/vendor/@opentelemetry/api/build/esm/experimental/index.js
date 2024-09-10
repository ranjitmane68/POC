'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _SugaredTracer = require('./trace/SugaredTracer');

Object.defineProperty(exports, 'wrapTracer', {
  enumerable: true,
  get: function get() {
    return _SugaredTracer.wrapTracer;
  }
});
Object.defineProperty(exports, 'SugaredTracer', {
  enumerable: true,
  get: function get() {
    return _SugaredTracer.SugaredTracer;
  }
});