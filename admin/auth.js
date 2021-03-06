// authentication
'use strict';

/**
 * show auth panel
 */
function showAuth (req, res, next) {
	var keys = req.appGlobal.viewKeys;

	req.viewVals [keys.CONTENT] =
		req.appGlobal.views.login;

	next ();
}

/**
 * check if request is authenticated and prepare view accordingly
 */
function checkAuthUser (req, res, next) {
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
}

module.exports = {
	showAuth: showAuth,
	checkAuthUser: checkAuthUser
};
