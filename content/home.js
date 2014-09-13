// home page
'use strict';

/**
 * setup home page route
 * @param router
 * @param params
 */
function setupHomePage (router, params) {
	var mViewsHome = require ('../views/home');
	params.appGlobal.views.home = mViewsHome.getHomeView (params);

	router.get (
		params.routes.root,

		function (req, res, next) {
			var keys = req.appGlobal.viewKeys;

			req.viewVals [keys.CONTENT] =
				req.appGlobal.views.home;

			next ();
		},

		params.appGlobal.render
	);
}

module.exports = {
	setupHomePage: setupHomePage
};
