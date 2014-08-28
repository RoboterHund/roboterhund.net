// server
'use strict';

var path = require ('path');

var connectMongo = require ('connect-mongo');
var cookieParser = require ('cookie-parser');
var express = require ('express');
var expressSession = require ('express-session');
var favicon = require ('serve-favicon');
var passport = require ('passport');

var mCommon = require ('../content/common');
var mPublic = require ('../routes/public');

var mAuth = require ('./auth');
var mDatabase = require ('./db');

/**
 * start server
 */
function startServer (rootDirName) {
	var mSetup = require ('./setup');
	var config = mSetup.configuration ();

	// express
	var app = express ();

	// database
	var database = mDatabase.database (config);

	// static server
	var staticDir = path.join (rootDirName, 'static');
	app.use (express.static (staticDir));

	// favicon
	app.use (favicon (path.join (staticDir, 'favicon.ico')));

	// cookies
	app.use (cookieParser ());

	// session
	var MongoStore = connectMongo (expressSession);
	var mongoStore = new MongoStore (
		{
			db: config.private.db.name,
			collection: config.private.db.collections.sessions,
			stringify: false
		}
	);
	app.use (
		expressSession (
			{
				secret: config.private.session.secret,
				store: mongoStore
			}
		)
	);

	// passport
	mAuth.usePassport (
		app, passport, config,
		database
	);

	// common handlers
	app.use (mCommon.toInit (database));
	app.use (mCommon.toCheckAuth (config));

	// router
	var router = new express.Router ();
	mPublic.setupPublicRoutes (router, config);
	var mAuthRoutes = require ('../routes/auth');
	mAuthRoutes.setupAuthRoutes (router, passport, config);
	app.use (router);

	// start listen port
	app.listen (config.private.port.listenPort);
}

module.exports = {
	startServer: startServer
};
