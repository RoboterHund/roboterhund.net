// authentication routes
'use strict';

/**
 * setup authentication routes
 * @param router
 * @param params
 */
function setupAuthRoutes (router, params) {
	var passport = require ('passport');
	var routes = params.routes;

	var successRedirect = toRedirectAuthenticated (routes.root);

	setupAuthStrategyRoutes (
		router,
		passport,
		'facebook',
		routes.facebookLogin,
		routes.facebookBack,
		routes.authFail,
		successRedirect
	);

	setupAuthStrategyRoutes (
		router,
		passport,
		'github',
		routes.githubLogin,
		routes.githubBack,
		routes.authFail,
		successRedirect);

	setupAuthStrategyRoutes (
		router,
		passport,
		'google',
		routes.googleLogin,
		routes.googleBack,
		routes.authFail,
		successRedirect);

	setupAuthStrategyRoutes (
		router,
		passport,
		'twitter',
		routes.twitterLogin,
		routes.twitterBack,
		routes.authFail,
		successRedirect);

	router.get (
		params.routes.logout,
		function (req, res) {
			req.logout ();
			res.redirect (routes.root);
		}
	);
}

/**
 * setup passport strategy routes
 * @param router
 * @param passport
 * @param provider
 * @param loginRoute
 * @param backRoute
 * @param failRoute
 * @param successRedirect
 */
function setupAuthStrategyRoutes (
	router,
	passport,
	provider,
	loginRoute,
	backRoute,
	failRoute,
	successRedirect) {

	router.get (
		loginRoute,
		passport.authenticate (provider),
		nop
	);

	router.get (
		backRoute,
		passport.authenticate (
			provider,
			{
				failureRedirect: failRoute
			}
		),
		successRedirect
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
	setupAuthRoutes: setupAuthRoutes
};
