'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _LoggerProvider = require('./LoggerProvider');

Object.defineProperty(exports, 'LoggerProvider', {
  enumerable: true,
  get: function get() {
    return _LoggerProvider.LoggerProvider;
  }
});

var _LogRecord = require('./LogRecord');

Object.defineProperty(exports, 'LogRecord', {
  enumerable: true,
  get: function get() {
    return _LogRecord.LogRecord;
  }
});

var _NoopLogRecordProcessor = require('./export/NoopLogRecordProcessor');

Object.defineProperty(exports, 'NoopLogRecordProcessor', {
  enumerable: true,
  get: function get() {
    return _NoopLogRecordProcessor.NoopLogRecordProcessor;
  }
});

var _ConsoleLogRecordExporter = require('./export/ConsoleLogRecordExporter');

Object.defineProperty(exports, 'ConsoleLogRecordExporter', {
  enumerable: true,
  get: function get() {
    return _ConsoleLogRecordExporter.ConsoleLogRecordExporter;
  }
});

var _SimpleLogRecordProcessor = require('./export/SimpleLogRecordProcessor');

Object.defineProperty(exports, 'SimpleLogRecordProcessor', {
  enumerable: true,
  get: function get() {
    return _SimpleLogRecordProcessor.SimpleLogRecordProcessor;
  }
});

var _InMemoryLogRecordExporter = require('./export/InMemoryLogRecordExporter');

Object.defineProperty(exports, 'InMemoryLogRecordExporter', {
  enumerable: true,
  get: function get() {
    return _InMemoryLogRecordExporter.InMemoryLogRecordExporter;
  }
});

var _platform = require('./platform');

Object.defineProperty(exports, 'BatchLogRecordProcessor', {
  enumerable: true,
  get: function get() {
    return _platform.BatchLogRecordProcessor;
  }
});