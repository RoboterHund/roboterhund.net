// common views
'use strict';

/**
 * common template
 * @returns {*}
 */
function getCommonTemplate (params) {
	var A = params.appGlobal.A;
	var keys = params.appGlobal.viewKeys;

	return A.template (
		A.DOCTYPE,
		A.head (
			A.title ('roboterhund.net')
		),
		A.body (
			A.insert (keys.CONTENT),
			A.div (
				A.id ('contUser'),
				A.insert (keys.CONT_USER),
				A.insert (keys.LOGIN_CONTROL)
			)
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

	/**
	 * login link list
	 */
	var login = A.string (
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
			provs: [
				{
					href: routes.facebookLogin,
					prov: 'Facebook'
				},
				{
					href: routes.githubLogin,
					prov: 'GitHub'
				},
				{
					href: routes.googleLogin,
					prov: 'Google'
				},
				{
					href: routes.twitterLogin,
					prov: 'Twitter'
				}
			]
		}
	);

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
	getCommonTemplate: getCommonTemplate,
	getAuthViews: getAuthViews
};
