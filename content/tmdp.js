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

module.exports = {
	playlist: playlist
};
