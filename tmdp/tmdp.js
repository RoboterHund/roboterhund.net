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

	var playlist = req.tempData.playlist;

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

	var playlistLength = req.appGlobal.youtube.list.length;
	for (i = from; i < to; i++) {
		playlistItem = playlist [i];
		var snippet = playlistItem.data.snippet;

		video = {};

		video [keys.VIDEO_POSITION] = playlistLength - playlistItem.pos + 1;
		video [keys.VIDEO_LINK] =
			'https://www.youtube.com/watch?v='
			+ snippet.resourceId.videoId
			+ '&list='
			+ playlistId;

		if (playlistItem.titleLinesHtml) {
			video [keys.VIDEO_TITLE] = playlistItem.titleLinesHtml;

		} else {
			video [keys.VIDEO_TITLE] = snippet.title;
		}

		video [keys.VIDEO_THUMBNAIL] = snippet.thumbnails.default.url;

		videos.push (video);
	}

	var style = req.appGlobal.styles.tmdp;
	if (!req.appGlobal.styles.tmdp) {
		var A = req.appGlobal.A;
		style = req.appGlobal.styles.tmdp =
			A.constant (A.stylesheet ('/css/tmdp.css'));
	}

	req.viewVals [keys.STYLE] = style;
	req.viewVals [keys.VIDEO_LOADER] = getLoader (req);
	req.viewVals [keys.VIDEO_PAGE_SELECT] = getPageSelect (req);
	req.viewVals [keys.VIDEO_PLAYLIST] = videos;

	if (req.tempData.searchTerm) {
		req.viewVals [keys.VIDEO_SEARCH_TERM] = req.tempData.searchTerm;

	} else {
		req.viewVals [keys.VIDEO_SEARCH_TERM] = '';
	}

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
					routes: require ('../routes/routes')
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
	var list = req.tempData.playlist;

	if (!list || list.length === 0) {
		return '';
	}

	if (req.tempData.searchTerm) {
		var A = req.appGlobal.A;
		return A.constant (
			A.div (
				A.inClass ('numResults'),
				(list.length == 1 ?
					'1 result.'
					: list.length + ' results.')
			)
		);
	}

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
	var routes = require ('../routes/routes');
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
			},
			excludeFrom: req.params.from,
			excludeTo: req.params.to
		}
	);
}

/**
 * show latest videos
 * @param req
 * @param res
 * @param next
 */
function latest (req, res, next) {
	var list = req.appGlobal.youtube.list;

	var showNumber = 50;

	var from = 1;
	var to = from + showNumber - 1;
	if (from > list.length) {
		to = list.length;
	}

	var showPlaylist = req.appGlobal.routes.showPlaylist;
	res.redirect (
			showPlaylist
			+ '/'
			+ from
			+ '/'
			+ to
	);
}

/**
 * show oldest videos
 * @param req
 * @param res
 * @param next
 */
function oldest (req, res, next) {
	var list = req.appGlobal.youtube.list;

	var showNumber = 50;

	var to = list.length;
	var from = to - showNumber + 1;
	if (from < 1) {
		from = 1;
	}

	var showPlaylist = req.appGlobal.routes.showPlaylist;
	res.redirect (
			showPlaylist
			+ '/'
			+ from
			+ '/'
			+ to
	);
}

/**
 * search
 * @param req
 * @param res
 * @param next
 */
function search (req, res, next) {
	var rawTerm = req.query.term;

	// http://stackoverflow.com/a/3561711
	var term = rawTerm.replace (/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

	var regexPrefix;
	if (/^[\000-\177]*$/.test (term)) {
		// term contains only ascii
		regexPrefix = '.*\\b';

	} else {
		// string contains non ascii
		regexPrefix = '.*';
	}

	var parts = term.match (/\S+/g);

	if (!parts) {
		res.redirect (req.appGlobal.routes.showPlaylistLatest);
		return;
	}

	var $andParts = [];

	var i;
	var n = parts.length;
	var regex;
	for (i = 0; i < n; i++) {
		regex = new RegExp (regexPrefix + parts [i] + '.*', 'i');
		req.appGlobal.debugs.tmdp ("regex [%d]: '%s'", i, regex);
		$andParts.push (
			{
				$or: [
					{
						'data.snippet.title': regex
					},
					{
						'data.snippet.description': regex
					}
				]
			}
		);
	}

	req.appGlobal.db.tmdpVideos ().find (
		{
			$and: $andParts
		},
		{
			sort: [
				['pos', -1]
			]
		},
		require ('../tmdp/youtube').toGetResultArray (
			function (items) {
				req.tempData.playlist = items;
				req.tempData.searchTerm = rawTerm;

				req.appGlobal.debugs.tmdp (items.length);

				next ();
			}
		)
	);
}

module.exports = {
	playlist: playlist,
	latest: latest,
	oldest: oldest,
	search: search
};
