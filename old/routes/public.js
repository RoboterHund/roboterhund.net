// public routes
'use strict';

/**
 * setup public routes
 * @param router Express router
 * @param config
 */
function setupPublicRoutes (router, config) {
	var root = config.root;

	var mCommon = require ('../content/common');
	var mPublic = require ('../content/public');

	router.get (
		root.ROUTE,
		mPublic.root,
		mCommon.render
	);
}

module.exports = {
	setupPublicRoutes: setupPublicRoutes
};
