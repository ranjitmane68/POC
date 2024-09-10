"use strict";

console.log("testing datadog logger");
// var logger = require('./app-out');
// var LogBody = require('./app-out');
// var LogAttributes = require('./app-out');

// logger.emit({
//     body: "Successfully  tested datadog logger!!! ",
//     attributes: "Testing attributes"
//   });

var ddLog = require('./app-out');
ddLog.logData('testing abc', 'testing attributes v2');
