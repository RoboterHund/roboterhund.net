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
		A.header (
			A.insert (keys.VIDEO_LOADER),
			'Videos list'
		),
		A.div (
			A.inClass ('content'),
			A.insert (keys.VIDEO_PAGE_SELECT),
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
			),
			A.insert (keys.VIDEO_PAGE_SELECT)
		),
		A.div (
			A.link (
				routes.login,
				'Login',
				'Admin'
			)
		)
	);
}

/**
 * get page selection view
 * @param appGlobal
 * @param params
 * @returns {string}
 */
function getPageSelectView (appGlobal, params) {
	var A = appGlobal.A;

	var pages = params.pages;
	var page;

	var items = [];
	var i;
	var n = pages.length;
	for (i = 0; i < n; i++) {
		page = pages [i];

		if (page.from >= params.excludeFrom
			&& page.to <= params.excludeTo) {

			items.push (page.to);

		} else {
			items.push (
				A.link (
					params.getRoute (page.from, page.to),
						'Show videos '
						+ page.from
						+ ', '
						+ page.to,
					page.to
				)
			);
		}
	}

	return A.constant (
		A.div (
			A.inClass ('pages'),
			A.macro.apply (null, items)
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
	getPageSelectView: getPageSelectView,
	getLoader: getLoader
};
