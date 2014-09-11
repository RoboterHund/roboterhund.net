// global app data
'use strict';

/**
 *
 * @param params
 * @param config
 * @returns {{}}
 */
function appData (params, config) {
	var data = {};

	var mDb = require ('./db');
	data.db = mDb.collections (params.db, config);

	return data;
}

module.exports = {
	appData: appData
};
