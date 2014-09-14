// common route handlers
'use strict';

/**
 * initialize request with common parameters
 * @param appGlobal
 * @returns {init}
 */
function toInit (appGlobal) {
	return function init (req, res, next) {
		req.appGlobal = appGlobal;
		req.tempData = {};
		req.viewVals = {};

		next ();
	};
}

/**
 * check if request is authenticated and prepare view accordingly
 * @param params
 * @returns {Function}
 */
function toCheckAuthUser (params) {
	var mViewsCommon = require ('../views/common');
	params.appGlobal.authViews = mViewsCommon.getAuthViews (params);

	return function checkAuthUser (req, res, next) {
		var authViews = req.appGlobal.authViews;
		var keys = req.appGlobal.viewKeys;

		if (req.isAuthenticated ()) {
			req.viewVals [keys.CONT_USER] = authViews.authUser;
			req.viewVals [keys.LOGIN_CONTROL] = authViews.logout;

			var userId = req.session.passport.user;

			req.appGlobal.db.users ().findOne (
				{
					_id: userId
				},
				function authUserFound (err, user) {
					if (err) {
						req.appGlobal.debugs.auth ('failed to find user ' + id);
						next (err);

					} else {
						req.viewVals [keys.AUTH_USER] = user.data.displayName;
						req.viewVals [keys.USER_FROM] = user.from;
						next ();
					}
				}
			);

		} else {
			req.viewVals [keys.CONT_USER] = authViews.noAuthUser;
			req.viewVals [keys.LOGIN_CONTROL] = authViews.login;

			next ();
		}
	};
}

/**
 * send rendered view
 * @returns {render}
 */
function toRender (params) {
	var mViewsCommon = require ('../views/common');
	params.appGlobal.views.rootTemplate =
		mViewsCommon.getCommonTemplate (params);

	return function render (req, res) {
		res.send (
			req.appGlobal.A.string (
				req.appGlobal.views.rootTemplate,
				req.viewVals
			)
		);
	};
}

module.exports = {
	toInit: toInit,
	toCheckAuthUser: toCheckAuthUser,
	toRender: toRender
};
