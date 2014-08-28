// database
'use strict';

/**
 *
 * @param config
 * @returns {*}
 */
function database (config) {
	var mongoskin = require ('mongoskin');
	var dbConfig = require ('../private/db');

	var db = mongoskin.db (
		dbConfig.connection,
		{
			native_parser: true
		}
	);

	config.debugs.main ('db connection created');

	return db;
}

module.exports = {
	database: database
};
