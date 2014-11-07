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
	var mContentHome = require ('../home/home');
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
	var mContentAdmin = require ('../admin/admin');
	var mContentTmdp = require ('../tmdp/tmdp');
	var mViewsPlaylist = require ('../views/playlist');
	var mYoutube = require ('../tmdp/youtube');

	var routes = params.routes;

	params.appGlobal.views.playlistTemplate =
		mViewsPlaylist.getTemplate (params);

	var redirect = mContentTmdp.oldest;

	router.get (
		routes.admin,
		mContentAdmin.showAdminPanel,
		params.appGlobal.render
	);

	router.get (
		routes.loadLatestPlaylistPage,
		mYoutube.allowAdminOperation,
		mYoutube.clearNextPageToken,
		mYoutube.youtubePlaylistPageRequest,
		mYoutube.storePlaylistPage,
		mContentAdmin.showAdminPanel,
		params.appGlobal.render
	);

	router.get (
		routes.resetPlaylistLoader,
		mYoutube.checkIsUserAdmin,
		mYoutube.clearNextPageToken,
		mYoutube.loadPlaylist,
		redirect
	);

	router.get (
		routes.loadNextPlaylistPage,
		mYoutube.checkIsUserAdmin,
		mYoutube.youtubePlaylistPageRequest,
		mYoutube.storePlaylistPage,
		mYoutube.loadPlaylist,
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

	router.get (
		routes.showPlaylistLatest,
		mYoutube.checkIsUserAdmin,
		mYoutube.loadPlaylist,
		mContentTmdp.latest
	);

	router.get (
		routes.showPlaylistSearch,
		mContentTmdp.search,
		mContentTmdp.playlist,
		params.appGlobal.render
	);

	// legacy route
	router.get (
		routes.legacy.kasanetetoList,
		function (req, res, next) {
			res.redirect (301, routes.showPlaylistLatest);
		}
	);

}

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