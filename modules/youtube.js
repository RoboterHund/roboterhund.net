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
		req.appGlobal.db.admins ().findOne (
			{
				key: req.session.passport.user
			},
			function authUserFound (err, user) {
				if (err) {
					req.appGlobal.debugs.auth ('failed to find user ' + id);
					next (err);

				} else {
					req.tempData.isAdmin = true;
					next ();
				}
			}
		);

	} else {
		next ();
	}
}

/**
 * check if user is marked in req as admin
 * @param req
 * @param res
 * @returns {boolean}
 */
function requireUserAdmin (req, res) {
	if (req.tempData.isAdmin) {
		return true;

	} else {
		res.redirect (require ('../routes/map').root);
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
	if (requireUserAdmin (req, res)) {

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
	if (requireUserAdmin (req, res)) {
		var data = req.tempData.youtubeData;

		storePlaylistItems (req, next, data, 0);
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

		var value = {
			pos: position,
			data: item
		};

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
 * clear next Youtube playlist page token
 * @param req
 * @param res
 * @param next
 */
function clearNextPageToken (req, res, next) {
	if (requireUserAdmin (req, res)) {
		delete req.session.nextYoutubePageToken;
		next ();
	}
}

/**
 * load from database the list of videos in the TMDP playlist
 * @param req
 * @param res
 * @param next
 */
function loadPlaylist (req, res, next) {
	req.appGlobal.db.tmdpVideos ().find (
		{},
		{
			sort: [
				['pos', -1]
			]
		},
		toGetResultArray (
			function usePlaylistArray (items) {
				req.appGlobal.youtube.list = items;
				next ();
			}
		)
	);
}

/**
 * convert
 * @param callback
 * @returns {Function}
 */
function toGetResultArray (callback) {
	return function getResultArray (err, result) {
		if (err) {
			next (err);

		} else {
			result.toArray (
				function useResultArray (err, items) {
					if (err) {
						next (err);

					} else {
						callback (items);
					}
				}
			);
		}
	};
}

module.exports = {
	checkIsUserAdmin: checkIsUserAdmin,
	youtubePlaylistPageRequest: youtubePlaylistPageRequest,
	storePlaylistPage: storePlaylistPage,
	clearNextPageToken: clearNextPageToken,
	loadPlaylist: loadPlaylist
};
