// database
'use strict';

/**
 *
 * @param config
 * @returns {*}
 */
function database (config) {
	var mongoskin = require ('mongoskin');

	var database = mongoskin.db (
		config.private.db.connection,
		{
			native_parser: true
		}
	);

	config.debugs.main ('db connection created');

	return database;
}

/**
 *
 * @param db
 * @param config
 * @returns {{}}
 */
function collections (db, config) {
	var dbCols = {};

	var collections = config.private.db.collections;

	dbCols.users = toCollection (db, collections.users);
	dbCols.sessions = toCollection (db, collections.sessions);

	return dbCols;
}

/**
 *
 * @param db
 * @param name
 * @returns {Function}
 */
function toCollection (db, name) {
	return function collection () {
		return db.collection (name);
	};
}

module.exports = {
	database: database,
	collections: collections
};
