// server
'use strict';

var express = require ('express');

var pmPort = require ('../private/port');

var mCommon = require ('../content/common');
var mPublic = require ('../routes/public');

/**
 * start server
 */
function startServer (rootDirName) {
	var app = express ();

	// common handlers
	app.use (mCommon.init ());

	// router
	var router = new express.Router ();
	mPublic.setupPublicRoutes (router);
	app.use (router);

	// start listen port
	app.listen (
		pmPort.listenPort
	);
}

module.exports = {
	startServer: startServer
};
