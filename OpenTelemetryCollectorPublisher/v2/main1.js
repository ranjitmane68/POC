var logger1 = require("./app1-babel");

// Attach the add function to the global window object
window.log1 = logger1.logData;
