// server
'use strict';

var path = require ('path');
var url = require ('url');

var connectMongo = require ('connect-mongo');
var cookieParser = require ('cookie-parser');
var express = require ('express');
var expressSession = require ('express-session');
var favicon = require ('serve-favicon');
var passport = require ('passport');

var pmPort = require ('../private/port');

var mCommon = require ('../content/common');
var mPublic = require ('../routes/public');

var mAuth = require ('./auth');
var mDatabase = require ('./db');

/**
 * start server
 */
function startServer (rootDirName) {
	var debugs = require ('./debug').debugs ();

	var host = url.format (
		{
			protocol: 'http',
			hostname: 'localhost',
			port: require ('../private/port').listenPort
		}
	);

	// express
	var app = express ();

	// database
	var dbConfig = require ('../private/db');
	var database = mDatabase.database (debugs.main);

	// static server
	var staticDir = path.join (rootDirName, 'static');
	app.use (express.static (staticDir));

	// favicon
	app.use (favicon (path.join (staticDir, 'favicon.ico')));

	// cookies
	app.use (cookieParser ());

	// session
	var sessionParams = require ('../private/session');
	var MongoStore = connectMongo (expressSession);
	var mongoStore = new MongoStore (
		{
			db: dbConfig.name,
			collection: dbConfig.collections.sessions,
			stringify: false
		}
	);
	app.use (
		expressSession (
			{
				secret: sessionParams.secret,
				store: mongoStore
			}
		)
	);

	// passport
	var map = require ('../routes/map');
	mAuth.usePassport (
		app, passport, host, map,
		database, debugs.auth
	);

	// common handlers
	app.use (mCommon.toInit (database));
	app.use (mCommon.toCheckAuth (debugs.auth));

	// router
	var router = new express.Router ();
	mPublic.setupPublicRoutes (router);
	var mAuthRoutes = require ('../routes/auth');
	mAuthRoutes.setupAuthRoutes (router, passport);
	app.use (router);

	// start listen port
	app.listen (pmPort.listenPort);
}

module.exports = {
	startServer: startServer
};
