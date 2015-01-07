// TMDP routes
'use strict';

/**
 * initialize TMDP routes
 * @param router
 * @param params
 */
function initTmdp (router, params) {
	var mContentAdmin = require ('../admin/admin');
	var mTmdpPlaylist = require ('../tmdp/playlist');
	var mViewsPlaylist = require ('../views/playlist');
	var mYoutube = require ('../tmdp/youtube');

	var routes = params.routes;

	params.appGlobal.views.playlistTemplate =
		mViewsPlaylist.getTemplate (params);
	params.appGlobal.views.contentTemplate =
		mViewsPlaylist.getContentTemplate (params);

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
		mTmdpPlaylist.oldest
	);

	router.get (
		routes.loadNextPlaylistPage,
		mYoutube.checkIsUserAdmin,
		mYoutube.youtubePlaylistPageRequest,
		mYoutube.storePlaylistPage,
		mTmdpPlaylist.oldest
	);

	router.get (
		routes.showPlaylist,
		mYoutube.checkIsUserAdmin,
		mTmdpPlaylist.showPlaylist,
		params.appGlobal.render
	);

	router.get (
		routes.showPlaylistFromTo,
		mYoutube.checkIsUserAdmin,
		mTmdpPlaylist.showPlaylist,
		params.appGlobal.render
	);

	router.get (
		routes.showPlaylistLatest,
		mYoutube.checkIsUserAdmin,
		mTmdpPlaylist.latest
	);

	router.get (
		routes.showPlaylistSearch,
		mTmdpPlaylist.search,
		params.appGlobal.render
	);

	// legacy route
	router.get (
		routes.legacy.kasanetetoList,
		function (req, res, next) {
			res.redirect (301, routes.showPlaylistLatest);
		}
	);

	// temporary fix route
	router.get (
		routes.tmdpFix,
		require ('../tmdp/fix').fix
	);
}

module.exports = {
	initTmdp: initTmdp
};
