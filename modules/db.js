// database
'use strict';

/**
 *
 * @param debug
 * @returns {*}
 */
function database (debug) {
	var mongoskin = require ('mongoskin');
	var config = require ('../private/db');

	var db = mongoskin.db (
		config.connection,
		{
			native_parser: true
		}
	);

	debug ('db connection created');

	return db;
}

module.exports = {
	database: database
};
