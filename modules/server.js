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

	var port = require ('../private/port');
	var server = app.listen (
		port.listenPort,
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
	params.host = url.format (
		{
			protocol: 'http',
			hostname: 'localhost',
			port: require ('../private/port').listenPort
		}
	);

	params.routes = require ('../routes/map');

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
			stringify: false
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

	var mLoginAuth = require ('./login/auth');
	mLoginAuth.usePassport (params);

	var mContentCommon = require ('../content/common');
	app.use (
		params.routes.root,
		mContentCommon.toInit (params.appGlobal)
	);
	app.use (
		params.routes.root,
		mContentCommon.toCheckAuthUser (params)
	);

	var router = createRouter (express, params);
	app.use (
		params.routes.root,
		router
	);

	return app;
}

/**
 * create express router
 * @param express
 * @param params
 */
function createRouter (express, params) {
	var router = new express.Router ();

	var mContentHome = require ('../content/home');
	mContentHome.setupHomePage (router, params);

	var mContentTmdp = require ('../content/tmdp');
	mContentTmdp.setupRoutes (router, params);

	var mAuthRoutes = require ('./login/routes');
	mAuthRoutes.setupAuthRoutes (router, params);

	//noinspection JSUnusedLocalSymbols
	router.get (
		'/fail',
		function (req, res, next) {
			throw new Error ('FAIL!');
		}
	);

	return router;
}

module.exports = {
	startServer: startServer
};
