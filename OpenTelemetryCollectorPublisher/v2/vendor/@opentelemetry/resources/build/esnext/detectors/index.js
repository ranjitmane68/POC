'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _platform = require('./platform');

Object.defineProperty(exports, 'hostDetector', {
  enumerable: true,
  get: function get() {
    return _platform.hostDetector;
  }
});
Object.defineProperty(exports, 'hostDetectorSync', {
  enumerable: true,
  get: function get() {
    return _platform.hostDetectorSync;
  }
});
Object.defineProperty(exports, 'osDetector', {
  enumerable: true,
  get: function get() {
    return _platform.osDetector;
  }
});
Object.defineProperty(exports, 'osDetectorSync', {
  enumerable: true,
  get: function get() {
    return _platform.osDetectorSync;
  }
});
Object.defineProperty(exports, 'processDetector', {
  enumerable: true,
  get: function get() {
    return _platform.processDetector;
  }
});
Object.defineProperty(exports, 'processDetectorSync', {
  enumerable: true,
  get: function get() {
    return _platform.processDetectorSync;
  }
});
Object.defineProperty(exports, 'serviceInstanceIdDetectorSync', {
  enumerable: true,
  get: function get() {
    return _platform.serviceInstanceIdDetectorSync;
  }
});

var _BrowserDetector = require('./BrowserDetector');

Object.defineProperty(exports, 'browserDetector', {
  enumerable: true,
  get: function get() {
    return _BrowserDetector.browserDetector;
  }
});

var _EnvDetector = require('./EnvDetector');

Object.defineProperty(exports, 'envDetector', {
  enumerable: true,
  get: function get() {
    return _EnvDetector.envDetector;
  }
});

var _BrowserDetectorSync = require('./BrowserDetectorSync');

Object.defineProperty(exports, 'browserDetectorSync', {
  enumerable: true,
  get: function get() {
    return _BrowserDetectorSync.browserDetectorSync;
  }
});

var _EnvDetectorSync = require('./EnvDetectorSync');

Object.defineProperty(exports, 'envDetectorSync', {
  enumerable: true,
  get: function get() {
    return _EnvDetectorSync.envDetectorSync;
  }
});