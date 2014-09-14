// The Miracle Diva Project
'use strict';

/**
 * show Kasane Teto Original Songs playlist
 * @param req
 * @param res
 * @param next
 */
function playlist (req, res, next) {
	var videos = [];

	var playlistId =
		require ('../private/youtube')
			.playlists.channelKasaneTetoOriginals;
	var keys = req.appGlobal.viewKeys;

	var playlist = req.appGlobal.youtube.list;

	var i;
	var n = playlist.length;
	var playlistItem;
	var video;
	for (i = 0; i < n; i++) {
		playlistItem = playlist [i];

		video = {};

		video [keys.VIDEO_POSITION] = playlistItem.pos;
		video [keys.VIDEO_LINK] =
			'https://www.youtube.com/watch?v='
			+ playlistItem.data.snippet.resourceId.videoId
			+ '&list='
			+ playlistId;
		video [keys.VIDEO_TITLE] = playlistItem.data.snippet.title;

		videos.push (video);
	}

	req.viewVals [keys.VIDEO_PLAYLIST] = videos;

	req.viewVals [keys.CONTENT] =
		req.appGlobal.views.playlistTemplate;

	next ();
}

/**
 * setup TMDP routes
 * @param router
 * @param params
 */
function setupRoutes (router, params) {
	params.appGlobal.views.playlistTemplate =
		require ('../views/playlist')
			.getTemplate (params);

	var routes = params.routes;
	var mYoutube = require ('../modules/youtube');

	var redirect = function playlistRedirect (req, res, next) {
		res.redirect (routes.playlist);
	};

	router.get (
		routes.playlist,
		mYoutube.loadPlaylist,
		playlist,
		params.appGlobal.render
	);

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
}

module.exports = {
	playlist: playlist,
	setupRoutes: setupRoutes
};
