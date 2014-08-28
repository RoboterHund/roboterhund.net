// auth routes
'use strict';

/**
 *
 * @param router
 * @param passport
 * @param config
 */
function setupAuthRoutes (router, passport, config) {
	var root = config.root;
	var loginRoute = root.login;
	var successRedirect = toRedirectAuthenticated (config);

	setupAuthStrategyRoutes (
		router, passport, config,
		loginRoute.facebook,
		'facebook',
		successRedirect);

	setupAuthStrategyRoutes (
		router, passport, config,
		loginRoute.github,
		'github',
		successRedirect);

	setupAuthStrategyRoutes (
		router, passport, config,
		loginRoute.google,
		'google',
		successRedirect);

	setupAuthStrategyRoutes (
		router, passport, config,
		loginRoute.twitter,
		'twitter',
		successRedirect);

	router.get (
		root.logout.ROUTE,
		function (req, res) {
			req.logout ();
			res.redirect (root.ROUTE);
		}
	);
}

function setupAuthStrategyRoutes (
	router, passport, config, loginRoute, provider, successRedirect) {

	router.get (
		loginRoute.ROUTE,
		passport.authenticate (provider),
		nop
	);

	router.get (
		loginRoute.back.ROUTE,
		passport.authenticate (
			provider,
			{
				failureRedirect: config.root.authFail.ROUTE
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
 *
 * @param config
 * @returns {Function}
 */
function toRedirectAuthenticated (config) {
	return function redirectAuthenticated (req, res) {
		res.redirect (config.root.ROUTE);
	};
}

module.exports = {
	setupAuthRoutes: setupAuthRoutes
};
