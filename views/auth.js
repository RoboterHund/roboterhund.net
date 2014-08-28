// auth views
'use strict';

var A = require ('april1-html');


var common = require ('./common');
var params = require ('./params');

function views (config) {
	var loginRoutes = config.root.login;

	/**
	 * login link list
	 */
	var login = A.string (
		A.template (
			A.ul (
				A.list (
					'provs',
					A.li (
						common.link (
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
					href: loginRoutes.facebook.ROUTE,
					prov: 'Facebook'
				},
				{
					href: loginRoutes.github.ROUTE,
					prov: 'GitHub'
				},
				{
					href: loginRoutes.google.ROUTE,
					prov: 'Google'
				},
				{
					href: loginRoutes.twitter.ROUTE,
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
					common.link (
						config.root.logout.ROUTE,
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
				A.insert (params.AUTH_USER)
			),
			' (',
			A.insert (params.USER_FROM),
			')'
		)
	);

	/**
	 * user not authenticated
	 */
	var noAuthUser = A.string (
		A.template (
			A.p ('no user')
		),
		{}
	);

	return {
		login: login,
		logout: logout,
		authUser: authUser,
		noAuthUser: noAuthUser
	};
}

module.exports = {
	views: views
};
