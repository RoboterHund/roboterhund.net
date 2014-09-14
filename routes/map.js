// site routes
'use strict';

module.exports = {
	root: '/',

	playlist: '/kasaneteto/videos',
	resetPlaylistLoader: '/kasaneteto/videos/load/reset',
	loadNextPlaylistPage: '/kasaneteto/videos/load/continue',

	authFail: '/auth-fail',

	facebookLogin: '/login/facebook',
	facebookBack: '/login/facebook/back',

	githubLogin: '/login/github/login',
	githubBack: '/login/github/back',

	googleLogin: '/login/google',
	googleBack: '/login/google/back',

	twitterLogin: '/login/twitter',
	twitterBack: '/login/twitter/back',

	login: '/login',
	logout: '/logout'
};
