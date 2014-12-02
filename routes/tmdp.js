// TMDP routes
'use strict';

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

module.exports = {
	initTmdp: initTmdp
};
