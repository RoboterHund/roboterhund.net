// video playlist view
'use strict';

function getTemplate (params) {
	var A = params.appGlobal.A;
	var keys = params.appGlobal.viewKeys;
	var routes = params.routes;

	return A.template (
		A.a (
			A.href (routes.resetPlaylistLoader),
			'Reset loader'
		),
		' | ',
		A.a (
			A.href (routes.loadNextPlaylistPage),
			'Load next page'
		),
		A.h1 ('Videos list'),
		A.ul (
			A.list (
				keys.VIDEO_PLAYLIST,
				A.li (
					A.insert (keys.VIDEO_POSITION),
					': ',
					A.a (
						A.href (A.insert (keys.VIDEO_LINK)),
						A.insert (keys.VIDEO_TITLE)
					)
				)
			)
		)
	);
}

module.exports = {
	getTemplate: getTemplate
};
