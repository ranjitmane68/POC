var logger = require('./app');

// Attach the add function to the global window object
window.log = logger.log;
