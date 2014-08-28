// server setup
'use strict';

/**
 *
 * @returns {{}}
 */
function configuration () {
	var config = {};

	var mDebug = require ('./debug');
	config.debugs = mDebug.debugs ();

	config.private = privateParams ();

	var url = require ('url');
	config.host = url.format (
		{
			protocol: 'http',
			hostname: 'localhost',
			port: require ('../private/port').listenPort
		}
	);

	var mMap = require ('../routes/map');
	config.root = mMap.root ();

	return config;
}

/**
 *
 * @returns {{}}
 */
function privateParams () {
	var params = {};

	params.auth = require ('../private/auth');
	params.db = require ('../private/db');
	params.port = require ('../private/port');
	params.session = require ('../private/session');

	return params;
}

module.exports = {
	configuration: configuration
};
