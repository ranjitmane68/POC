var logger = require("./app-babel");
var tracer = require("./tracer-babel");
window.logData = logger.logData;
window.tracer = tracer.tracer;
// window.startSpan = tracer.startSpan;
// window.endSpan = tracer.endSpan;
