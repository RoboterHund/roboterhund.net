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

	var from = parseInt (req.params.from);

	if (isNaN (from) || from < 1) {
		from = 0;

	} else {
		from -= 1;
	}

	var to = parseInt (req.params.to);

	if (isNaN (to) || to > playlist.length) {
		to = playlist.length;
	}

	var i;
	var playlistItem;
	var video;
	for (i = to - 1; i >= from; i--) {
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

	req.viewVals [keys.VIDEO_LOADER] = getLoader (req);
	req.viewVals [keys.VIDEO_PAGE_SELECT] = getPageSelect (req);
	req.viewVals [keys.VIDEO_PLAYLIST] = videos;

	req.viewVals [keys.CONTENT] =
		req.appGlobal.views.playlistTemplate;

	next ();
}

/**
 * get playlist loader view
 * @param req
 * @returns {string}
 */
function getLoader (req) {
	if (req.tempData.isAdmin) {
		var appGlobal = req.appGlobal;
		var loader = appGlobal.views.loader;

		if (!loader) {
			var mPlaylist = require ('../views/playlist');
			appGlobal.views.loader = mPlaylist.getLoader (
				{
					appGlobal: {
						A: appGlobal.A
					},
					routes: require ('./routes')
				}
			);
			loader = appGlobal.views.loader;
		}

		return loader;

	} else {
		return '';
	}
}

/**
 * get playlist page selection view
 * @param req
 * @returns {string}
 */
function getPageSelect (req) {
	var list = req.appGlobal.youtube.list;

	var pages = [];

	var lastItem = list.length;
	var pageSize = 50;
	var offset = pageSize - 1;
	var from = 1;
	var to;
	while (from <= lastItem) {
		to = from + offset;
		if (to > lastItem) {
			to = lastItem;
		}

		pages.push (
			{
				from: from,
				to: to
			}
		);

		from += pageSize;
	}

	var mViewsPlaylist = require ('../views/playlist');
	var routes = require ('./routes');
	var showPlaylist = routes.showPlaylist;

	return mViewsPlaylist.getPageSelectView (
		req.appGlobal,
		{
			pages: pages,
			getRoute: function (from, to) {
				return (
					showPlaylist
					+ '/'
					+ from
					+ '/'
					+ to
					);
			}
		}
	);
}

module.exports = {
	playlist: playlist
};
