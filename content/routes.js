// site routes
'use strict';

module.exports = {
	root: '/',

	resetPlaylistLoader: '/kasaneteto/videos/load/reset',
	loadNextPlaylistPage: '/kasaneteto/videos/load/continue',

	showPlaylist: '/kasaneteto/videos',
	showPlaylistFromTo: '/kasaneteto/videos/:from/:to',
	showPlaylistLatest: '/kasaneteto/videos/latest',

	login: '/login',

	facebookLogin: '/login/facebook',
	facebookBack: '/login/facebook/back',

	githubLogin: '/login/github/login',
	githubBack: '/login/github/back',

	googleLogin: '/login/google',
	googleBack: '/login/google/back',

	twitterLogin: '/login/twitter',
	twitterBack: '/login/twitter/back',

	logout: '/logout',

	authFail: '/auth-fail'
};
