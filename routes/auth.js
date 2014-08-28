// auth routes
'use strict';

/**
 *
 * @param router
 * @param passport
 */
function setupAuthRoutes (router, passport) {
	var mMap = require ('./map');
	var root = mMap.root ();

	var loginRoute = root.login;
	var successRedirect = toRedirectAuthenticated (mMap);

	setupAuthStrategyRoutes (
		router, passport, mMap,
		loginRoute.facebook,
		'facebook',
		successRedirect);

	setupAuthStrategyRoutes (
		router, passport, mMap,
		loginRoute.github,
		'github',
		successRedirect);

	setupAuthStrategyRoutes (
		router, passport, mMap,
		loginRoute.google,
		'google',
		successRedirect);

	setupAuthStrategyRoutes (
		router, passport, mMap,
		loginRoute.twitter,
		'twitter',
		successRedirect);

	router.get (
		root.logout.ROUTE,
		function (req, res) {
			req.logout ();
			res.redirect (mMap.root ().ROUTE);
		}
	);
}

function setupAuthStrategyRoutes (
	router, passport, mMap, loginRoute, provider, successRedirect) {

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
				failureRedirect: mMap.root ().authFail.ROUTE
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
 * @param mMap
 * @returns {Function}
 */
function toRedirectAuthenticated (mMap) {
	return function redirectAuthenticated (req, res) {
		res.redirect (mMap.root ().ROUTE);
	};
}

module.exports = {
	setupAuthRoutes: setupAuthRoutes
};
