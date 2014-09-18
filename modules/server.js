// server
'use strict';

/**
 * start server
 * @param rootDirName
 */
function startServer (rootDirName) {
	var debugs = require ('./debug').getDebugs ();
	var mainDebug = debugs.main;

	var app = setupServer (rootDirName, debugs);

	var listenPort = require ('../private/server').listenPort;
	var server = app.listen (
		listenPort,
		function () {
			mainDebug (
				'start server listen on port %s',
				server.address ().port
			);
		}
	);
}

/**
 * setup server
 * @param rootDirName
 * @param debugs
 * @returns {*}
 */
function setupServer (rootDirName, debugs) {
	var params = {};
	params.debugs = debugs;

	var url = require ('url');
	var serverParams = require ('../private/server');
	params.host = url.format (
		{
			protocol: 'http',
			hostname: serverParams.host,
			port: serverParams.hostPort
		}
	);

	params.routes = require ('../content/routes');

	var express = require ('express');
	var app = express ();
	params.app = app;

	var mDatabase = require ('./database');
	params.db = require ('../private/db');
	params.database = mDatabase.getDatabase (params);
	params.collections = mDatabase.getCollections (params);

	var mGlobal = require ('./global');
	mGlobal.initGlobalData (params);

	var path = require ('path');
	var staticDir = path.join (rootDirName, 'static');
	app.use (
		params.routes.root,
		express.static (staticDir)
	);

	var favicon = require ('serve-favicon');
	app.use (
		params.routes.root,
		favicon (path.join (staticDir, 'favicon.ico'))
	);

	var cookieParser = require ('cookie-parser');
	app.use (
		params.routes.root,
		cookieParser ()
	);

	var connectMongo = require ('connect-mongo');
	var expressSession = require ('express-session');
	var MongoStore = connectMongo (expressSession);
	var mongoStore = new MongoStore (
		{
			db: params.db.name,
			collection: params.db.collections.sessions,
			stringify: false,
			port: params.db.port
		}
	);
	app.use (
		params.routes.root,
		expressSession (
			{
				secret: require ('../private/session').secret,
				store: mongoStore
			}
		)
	);

	var mAuth = require ('./auth');
	mAuth.usePassport (params);

	var mContentCommon = require ('../content/common');
	app.use (
		params.routes.root,
		mContentCommon.toInit (params.appGlobal)
	);

	var mContentAuth = require ('../content/auth');
	app.use (
		params.routes.root,
		mContentAuth.toCheckAuthUser (params)
	);

	var mContentInit = require ('../content/init');
	var router = new express.Router ();
	mContentInit.init (router, params);
	app.use (
		params.routes.root,
		router
	);

	return app;
}

module.exports = {
	startServer: startServer
};
