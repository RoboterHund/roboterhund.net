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

	var authParams = require ('../private/auth');
	var providers = [];
	if (authParams.facebook.enabled) {
		providers.push (
			{
				href: routes.facebookLogin,
				prov: 'Facebook'
			}
		);
	}
	if (authParams.github.enabled) {
		providers.push (
			{
				href: routes.githubLogin,
				prov: 'GitHub'
			}
		);
	}
	if (authParams.google.enabled) {
		providers.push (
			{
				href: routes.googleLogin,
				prov: 'Google'
			}
		);
	}
	if (authParams.twitter.enabled) {
		providers.push (
			{
				href: routes.twitterLogin,
				prov: 'Twitter'
			}
		);
	}

	var loginEnabled = providers.length !== 0;

	var login;
	if (loginEnabled) {
		/**
		 * login link list
		 */
		login = A.string (
			A.template (
				A.ul (
					A.list (
						'provs',
						A.li (
							A.link (
								A.insert ('href'),
								A.macro (
									'Login with ',
									A.insert ('prov')
								),
								A.insert ('prov')
							)
						)
					)
				)
			),
			{
				provs: providers
			}
		);

	} else {
		login = A.constant (
			A.p (
				'Login has been disabled.'
			)
		);
	}

	var logoutLabel = 'Logout';

	var logout = A.string (
		A.template (
			A.ul (
				A.li (
					A.link (
						routes.logout,
						logoutLabel,
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
		A.p (
			'user: ',
			A.span (
				A.inClass ('user'),
				A.insert (keys.AUTH_USER)
			),
			' (',
			A.insert (keys.USER_FROM),
			')'
		)
	);

	/**
	 * user not authenticated
	 */
	var noAuthUser = A.constant (
		A.p ('no user')
	);

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
