'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _node = require('./node');

Object.defineProperty(exports, 'OTLPExporterNodeBase', {
  enumerable: true,
  get: function get() {
    return _node.OTLPExporterNodeBase;
  }
});
Object.defineProperty(exports, 'sendWithHttp', {
  enumerable: true,
  get: function get() {
    return _node.sendWithHttp;
  }
});
Object.defineProperty(exports, 'createHttpAgent', {
  enumerable: true,
  get: function get() {
    return _node.createHttpAgent;
  }
});
Object.defineProperty(exports, 'configureCompression', {
  enumerable: true,
  get: function get() {
    return _node.configureCompression;
  }
});
Object.defineProperty(exports, 'CompressionAlgorithm', {
  enumerable: true,
  get: function get() {
    return _node.CompressionAlgorithm;
  }
});

var _browser = require('./browser');

Object.defineProperty(exports, 'OTLPExporterBrowserBase', {
  enumerable: true,
  get: function get() {
    return _browser.OTLPExporterBrowserBase;
  }
});
Object.defineProperty(exports, 'sendWithXhr', {
  enumerable: true,
  get: function get() {
    return _browser.sendWithXhr;
  }
});