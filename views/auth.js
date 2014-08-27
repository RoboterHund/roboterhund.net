// auth views
'use strict';

var A = require ('april1-html');

var mMap = require ('../routes/map');
var root = mMap.root;
var loginRoutes = root.login;

var common = require ('./common');
var params = require ('./params');

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
					root.logout.ROUTE,
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

module.exports = {
	login: login,
	logout: logout,
	authUser: authUser,
	noAuthUser: noAuthUser
};
