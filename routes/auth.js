// auth routes
'use strict';

/**
 * initialize authentication routes
 * @param router
 * @param params
 */
function initAuth (router, params) {
	var routes = params.routes;

	var mContentAuth = require ('../admin/auth');
	router.get (
		routes.login,
		function adminRedirect (req, res) {
			res.redirect (routes.admin);
		}
	);

	var authParams = require ('../private/auth');
	var setupParams = {};

	setupParams.router = router;
	setupParams.passport = require ('passport');
	setupParams.failRoute = routes.authFail;
	setupParams.successRedirect =
		toRedirectAuthenticated (routes.admin);

	if (authParams.facebook.enabled) {
		setupParams.provider = 'facebook';
		setupParams.loginRoute = routes.facebookLogin;
		setupParams.backRoute = routes.facebookBack;
		setupAuthStrategyRoutes (setupParams);
	}

	if (authParams.github.enabled) {
		setupParams.provider = 'github';
		setupParams.loginRoute = routes.githubLogin;
		setupParams.backRoute = routes.githubBack;
		setupAuthStrategyRoutes (setupParams);
	}

	if (authParams.google.enabled) {
		setupParams.provider = 'google';
		setupParams.loginRoute = routes.googleLogin;
		setupParams.backRoute = routes.googleBack;
		setupAuthStrategyRoutes (setupParams);
	}

	if (authParams.twitter.enabled) {
		setupParams.provider = 'twitter';
		setupParams.loginRoute = routes.twitterLogin;
		setupParams.backRoute = routes.twitterBack;
		setupAuthStrategyRoutes (setupParams);
	}

	var mAuth = require ('../common/auth');
	router.get (
		params.routes.logout,
		mAuth.logout
	);
}

/**
 * setup passport strategy routes
 * @param params
 */
function setupAuthStrategyRoutes (params) {

	params.router.get (
		params.loginRoute,
		params.passport.authenticate (params.provider),
		nop
	);

	params.router.get (
		params.backRoute,
		params.passport.authenticate (
			params.provider,
			{
				failureRedirect: params.failRoute
			}
		),
		params.successRedirect
	);

}

/**
 * empty route handler
 */
function nop () {
}

/**
 * redirect successfully authenticated requests
 * @param route
 * @returns {Function}
 */
function toRedirectAuthenticated (route) {
	return function redirectAuthenticated (req, res) {
		res.redirect (route);
	};
}

module.exports = {
	initAuth: initAuth
};
