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

module.exports = {
	configuration: configuration
};
