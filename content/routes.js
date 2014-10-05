// site routes
'use strict';

module.exports = {
	root: '/',

	resetPlaylistLoader: '/kasaneteto/videos/load/reset',
	loadNextPlaylistPage: '/kasaneteto/videos/load/continue',
	loadLatestPlaylistPage: '/kasaneteto/videos/load/latest',

	showPlaylist: '/kasaneteto/videos/list',
	showPlaylistFromTo: '/kasaneteto/videos/list/:from/:to',
	showPlaylistLatest: '/kasaneteto/videos/latest',
	showPlaylistSearch: '/kasaneteto/videos/search',

	admin: '/admin',
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

	authFail: '/auth-fail',

	legacy: {
		kasanetetoList: '/tmdp/list'
	}
};
