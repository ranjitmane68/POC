var logger = require("./app-babel");
var tracer = require("./tracer-babel");
window.logData = logger.logData;
window.tracer = tracer.getTracer;
window.startSpan = tracer.startSpan;
window.endSpan = tracer.endSpan;
window.setAttribute = tracer.setAttribute;
