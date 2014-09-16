// server initialization
'use strict';

/**
 * initialize server
 * @param router
 * @param params
 */
function init (router, params) {
	initHome (router, params);
	initTmdp (router, params);
	initAuth (router, params);
	initFail (router, params);
}

/**
 * initialize home routes
 * @param router
 * @param params
 */
function initHome (router, params) {
	var mContentHome = require ('../content/home');
	var mViewsHome = require ('../views/home');

	params.appGlobal.views.home =
		mViewsHome.getHomeView (params);

	router.get (
		params.routes.root,
		mContentHome.homePage,
		params.appGlobal.render
	);
}

/**
 * initialize TMDP routes
 * @param router
 * @param params
 */
function initTmdp (router, params) {
	var mContentTmdp = require ('../content/tmdp');
	var mViewsPlaylist = require ('../views/playlist');
	var mYoutube = require ('../modules/youtube');

	var routes = params.routes;

	params.appGlobal.views.playlistTemplate =
		mViewsPlaylist.getTemplate (params);

	var redirect = function playlistRedirect (req, res, next) {
		res.redirect (routes.showPlaylist);
	};

	router.get (
		routes.resetPlaylistLoader,
		mYoutube.checkIsUserAdmin,
		mYoutube.clearNextPageToken,
		redirect
	);

	router.get (
		routes.loadNextPlaylistPage,
		mYoutube.checkIsUserAdmin,
		mYoutube.youtubePlaylistPageRequest,
		mYoutube.storePlaylistPage,
		redirect
	);

	router.get (
		routes.showPlaylist,
		mYoutube.checkIsUserAdmin,
		mYoutube.loadPlaylist,
		mContentTmdp.playlist,
		params.appGlobal.render
	);

	router.get (
		routes.showPlaylistFromTo,
		mYoutube.checkIsUserAdmin,
		mYoutube.loadPlaylist,
		mContentTmdp.playlist,
		params.appGlobal.render
	);
}

/**
 * initialize authentication routes
 * @param router
 * @param params
 */
function initAuth (router, params) {
	var routes = params.routes;

	var mContentAuth = require ('../content/auth');
	router.get (
		routes.login,
		mContentAuth.toShowAuth (params),
		params.appGlobal.render
	);

	var authParams = require ('../private/auth');
	var setupParams = {};

	setupParams.router = router;
	setupParams.passport = require ('passport');
	setupParams.failRoute = routes.authFail;
	setupParams.successRedirect =
		toRedirectAuthenticated (routes.root);

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

	var mAuth = require ('../modules/auth');
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

/**
 * create a route that always throws an exception
 * (deliberately)
 * @param router
 * @param params
 */
function initFail (router, params) {
	router.get (
		'/fail',
		function (req, res, next) {
			throw new Error ('FAIL!');
		}
	);
}

module.exports = {
	init: init
};
