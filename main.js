// main module
'use strict';

var mServer = require ('./modules/server');

var startServer = mServer.startServer ;

startServer (__dirname);
