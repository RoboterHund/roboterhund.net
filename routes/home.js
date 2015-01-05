// roboterhund.net home
'use strict';

/**
 * initialize home routes
 * @param router
 * @param params
 */
function initHome (router, params) {
	var mContentHome = require ('../home/home');
	var mViewsHome = require ('../views/home');

	params.appGlobal.views.home =
		mViewsHome.getHomeView (params);

	router.get (
		params.routes.root,
		mContentHome.homePage,
		params.appGlobal.render
	);
}

module.exports = {
	initHome: initHome
};
