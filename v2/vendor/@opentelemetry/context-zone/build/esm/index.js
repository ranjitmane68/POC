'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ZoneContextManager = undefined;

var _contextZonePeerDep = require('@opentelemetry/context-zone-peer-dep');

Object.defineProperty(exports, 'ZoneContextManager', {
  enumerable: true,
  get: function get() {
    return _contextZonePeerDep.ZoneContextManager;
  }
});

require('zone.js');