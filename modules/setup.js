// server setup
'use strict';

/**
 *
 * @returns {{}}
 */
function configuration () {
	var config = {};

	var mMap = require ('../routes/map');
	config.root = mMap.root ();

	return config;
}

module.exports = {
	configuration: configuration
};
