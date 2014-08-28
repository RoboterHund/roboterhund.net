// public routes
'use strict';

/**
 * setup public routes
 * @param router Express router
 */
function setupPublicRoutes (router) {
	var mMap = require ('./map');
	var root = mMap.root ();

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
