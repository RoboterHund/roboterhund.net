// YouTube connection module
'use strict';

/**
 * write to req whether user is admin
 * @param req
 * @param res
 * @param next
 */
function checkIsUserAdmin (req, res, next) {
	req.tempData.isAdmin = false;

	if (req.isAuthenticated ()) {
		var userId = req.session.passport.user;

		req.appGlobal.db.admins ().findOne (
			{
				key: userId.toString ()
			},
			function adminUserFound (err, user) {
				if (err) {
					req.appGlobal.debugs.tmdp ('failed to find user ' + userId);
					next (err);

				} else if (user !== null) {
					req.tempData.isAdmin = true;
					next ();

				} else {
					next ();
				}
			}
		);

	} else {
		next ();
	}
}

/**
 * Allow admin operation without authentication.
 * @param req
 * @param res
 * @param next
 */
function allowAdminOperation (req, res, next) {
	req.tempData.tmdpWriteAllowed = true;
	next ();
}

/**
 * check if user is marked in req as admin
 * @param req
 * @param res
 * @returns {boolean}
 */
function requireUserAdmin (req, res) {
	if (req.tempData.isAdmin) {
		req.appGlobal.debugs.tmdp ('user is admin');
		return true;

	} else {
		req.appGlobal.debugs.tmdp ('user NOT admin');
		res.redirect (require ('../routes/routes').admin);
		return false;
	}
}

/**
 * request, via YouTube API, a page of videos from a playlist
 * @param req
 * @param res
 * @param next
 */
function youtubePlaylistPageRequest (req, res, next) {
	if (req.tempData.tmdpWriteAllowed ||
		requireUserAdmin (req, res)) {

		var Youtube = require ('youtube-api');
		var youtubeParams = require ('../private/youtube');

		Youtube.authenticate ({
			type: 'key',
			key: youtubeParams.apiKey
		});

		var options = {
			part: 'id,snippet,status',
			playlistId: youtubeParams.playlists.channelKasaneTetoOriginals,
			maxResults: 50
		};

		var pageToken = req.session.nextYoutubePageToken;
		if (pageToken) {
			options.pageToken = pageToken;
		}

		Youtube.playlistItems.list (
			options,
			function usePlaylistItemResponse (err, data) {
				if (err) {
					next (err);

				} else {
					req.tempData.youtubeData = data;
					req.session.nextYoutubePageToken = data.nextPageToken;

					next ();
				}
			}
		);
	}
}

/**
 * store in database the playlist page items
 * @param req
 * @param res
 * @param next
 */
function storePlaylistPage (req, res, next) {
	if (req.tempData.tmdpWriteAllowed ||
		requireUserAdmin (req, res)) {

		var data = req.tempData.youtubeData;

		req.appGlobal.debugs.tmdp (
			'items retrieved: %d',
			data.items.length
		);

		req.appGlobal.youtube.listLength =
			data.pageInfo.totalResults;

		storePlaylistItems (req, next, data, 0);

		// invalidate cache
		req.appGlobal.youtube.list = null;
	}
}

/**
 * store in database the next playlist item,
 * repeat recursively until all are stored
 * @param req
 * @param next
 * @param data
 * @param index
 */
function storePlaylistItems (req, next, data, index) {
	var items = data.items;
	if (index < items.length) {
		var item = items [index];
		var position = data.pageInfo.totalResults - item.snippet.position;

		var key = {
			pos: position
		};

		var value = analyzeData (req.appGlobal, position, item);

		req.appGlobal.db.tmdpVideos ().update (
			key,
			value,
			{
				upsert: true
			},
			function onPlaylistItemStored (err) {
				if (err) {
					next (err);

				} else {
					storePlaylistItems (req, next, data, index + 1);
				}
			}
		);

	}
	else {
		next ();
	}
}

/**
 * analyze TMDP track data
 * @param appGlobal
 * @param position
 * @param data
 * @returns {{}} value
 */
function analyzeData (appGlobal, position, data) {
	var value = {
		pos: position,
		data: data
	};

	var title = data.snippet.title.trim ();
	var openDelims = ['(', '【', '『'];
	var closeDelims = {
		'(': ')',
		'【': '】',
		'『': '』'
	};

	var i = 0;
	var n = title.length;
	var di;
	var dn = openDelims.length;
	var pos;
	var search;
	var openDelimPos;
	var openDelim;
	var closeDelimPos;
	var closeDelim;
	var line = '';
	var titleLines = [];

	while (i < n) {
		openDelimPos = n;

		for (di = 0; di < dn; di++) {
			search = openDelims [di];

			pos = title.indexOf (search, i);

			if (pos !== -1 && pos < openDelimPos) {
				openDelimPos = pos;
				openDelim = search;
			}
		}

		line = title.substring (i, openDelimPos).trim ();

		if (line.length > 0) {
			pushTitleLine (appGlobal, titleLines, line, null);
		}

		closeDelim = closeDelims [openDelim];

		closeDelimPos = title.indexOf (closeDelim, openDelimPos);

		if (closeDelimPos !== -1) {
			i = closeDelimPos + 1;

		} else {
			i = n;
		}

		line = title.substring (openDelimPos, i).trim ();

		if (line.length > 0) {
			pushTitleLine (appGlobal, titleLines, line, openDelim);
		}
	}

	value.titleLinesHtml =
		require ('../views/playlist')
			.getTitleLinesView (appGlobal.A, titleLines);

	return value;
}

function pushTitleLine (appGlobal, titleLines, line, openDelim) {
	var inClass = '';

	if (openDelim != null) {
		if (line.indexOf ('【Original') == 0) {
			return;
		}

		if (openDelim == '【'
			|| openDelim == '『') {
			// reduce indent
			inClass += ' ri';
		}

		if (openDelim == '('
			&& !appGlobal.f.isAscii (line)) {
			// show with Japanese font
			inClass += ' sjp';
		}

		if (line == '『Teto\'s Day Fest 2014』') {
			// make smaller
			inClass += ' sm';
		}
	}

	titleLines.push (
		{
			inClass: inClass,
			line: line
		}
	);
}

/**
 * clear next Youtube playlist page token
 * @param req
 * @param res
 * @param next
 */
function clearNextPageToken (req, res, next) {
	if (req.tempData.tmdpWriteAllowed ||
		requireUserAdmin (req, res)) {

		req.session.nextYoutubePageToken = null;
		next ();
	}
}

module.exports = {
	checkIsUserAdmin: checkIsUserAdmin,
	allowAdminOperation: allowAdminOperation,
	youtubePlaylistPageRequest: youtubePlaylistPageRequest,
	storePlaylistPage: storePlaylistPage,
	clearNextPageToken: clearNextPageToken
};
