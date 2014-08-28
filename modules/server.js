// server
'use strict';

var path = require ('path');

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
	var modules = config.modules;

	// express
	var app = modules.express ();

	// database
	var database = mDatabase.database (config);

	// static server
	var staticDir = path.join (rootDirName, 'static');
	app.use (
		config.root.ROUTE,
		modules.express.static (staticDir)
	);

	// favicon
	app.use (
		config.root.ROUTE,
		modules.favicon (path.join (staticDir, 'favicon.ico'))
	);

	// cookies
	app.use (
		config.root.ROUTE,
		modules.cookieParser ()
	);

	// session
	var MongoStore = modules.connectMongo (modules.expressSession);
	var mongoStore = new MongoStore (
		{
			db: config.private.db.name,
			collection: config.private.db.collections.sessions,
			stringify: false
		}
	);
	app.use (
		config.root.ROUTE,
		modules.expressSession (
			{
				secret: config.private.session.secret,
				store: mongoStore
			}
		)
	);

	// passport
	mAuth.usePassport (app, database, config);

	// common handlers
	app.use (
		config.root.ROUTE,
		mCommon.toInit (database)
	);
	app.use (
		config.root.ROUTE,
		mCommon.toCheckAuth (config)
	);

	// router
	var router = new modules.express.Router ();
	mPublic.setupPublicRoutes (router, config);
	var mAuthRoutes = require ('../routes/auth');
	mAuthRoutes.setupAuthRoutes (router, modules.passport, config);
	app.use (
		config.root.ROUTE,
		router
	);

	// start listen port
	app.listen (config.private.port.listenPort);
}

module.exports = {
	startServer: startServer
};
