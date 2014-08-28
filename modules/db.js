// database
'use strict';

/**
 *
 * @param config
 * @returns {*}
 */
function database (config) {
	var mongoskin = require ('mongoskin');

	var db = mongoskin.db (
		config.private.db.connection,
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
