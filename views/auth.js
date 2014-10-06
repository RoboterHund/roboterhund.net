// authentication views
'use strict';

/**
 * get login view
 * @param params
 * @returns {*}
 */
function getLoginView (params) {
	var A = params.appGlobal.A;
	var keys = params.appGlobal.viewKeys;

	return A.template (
		A.div (
			A.id ('contUser'),
			A.insert (keys.CONT_USER),
			A.insert (keys.LOGIN_CONTROL)
		)
	);
}

/**
 * auth views
 * @param params
 * @returns {{}}
 */
function getAuthViews (params) {
	var routes = params.routes;

	var A = params.appGlobal.A;
	var keys = params.appGlobal.viewKeys;

	var login = A.constant (
		A.alink (
			routes.twitterLogin,
			' Admin access',
			A.fontawesome ('twitter-square')
		)
	);

	var logoutLabel = 'Logout';

	var logout = A.string (
		A.template (
			A.ul (
				A.li (
					A.alink (
						routes.logout,
						logoutLabel
					)
				)
			)
		)
	);

	/**
	 * authenticated user template
	 */
	var authUser = A.template (
		'Authenticated user: ',
		A.span (
			A.inClass ('user'),
			A.insert (keys.AUTH_USER)
		),
		' (',
		A.insert (keys.USER_FROM),
		') '
	);

	/**
	 * user not authenticated
	 */
	var noAuthUser = 'Accessing as anonymous user. ';

	return {
		login: login,
		logout: logout,
		authUser: authUser,
		noAuthUser: noAuthUser
	};
}

module.exports = {
	getLoginView: getLoginView,
	getAuthViews: getAuthViews
};
