// database
'use strict';

/**
 * get mongoskin database
 * @param config
 * @returns {*}
 */
function getDatabase (config) {
	var mongoskin = require ('mongoskin');

	var database = mongoskin.db (
		config.db.connection,
		{
			native_parser: true
		}
	);

	config.debugs.main ('db connection created');

	return database;
}

/**
 * get mongodb database collections
 * @param params
 * @returns {{}}
 */
function getCollections (params) {
	var collections = {};

	var database = params.database;
	var names = params.db.collections;

	collections.admins = function getAdmins () {
		return database.collection (names.admins);
	};
	collections.tmdpVideos = function getAdmins () {
		return database.collection (names.tmdpVideos);
	};
	collections.sessions = function getSessions () {
		return database.collection (names.sessions);
	};
	collections.users = function getUsers () {
		return database.collection (names.users);
	};

	return collections;
}

module.exports = {
	getDatabase: getDatabase,
	getCollections: getCollections
};
