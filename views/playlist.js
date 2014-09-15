// video playlist view
'use strict';

/**
 * get playlist template
 * @param params
 * @returns {*}
 */
function getTemplate (params) {
	var A = params.appGlobal.A;
	var keys = params.appGlobal.viewKeys;
	var routes = params.routes;

	return A.template (
		A.insert (keys.VIDEO_LOADER),
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

/**
 * get playlist loader template
 * @param params
 * @returns {*}
 */
function getLoader (params) {
	var A = params.appGlobal.A;
	var routes = params.routes;

	return A.constant (
		A.p (
			A.a (
				A.href (routes.resetPlaylistLoader),
				'Reset loader'
			),
			' | ',
			A.a (
				A.href (routes.loadNextPlaylistPage),
				'Load next page'
			)
		)
	);
}

module.exports = {
	getTemplate: getTemplate,
	getLoader: getLoader
};
