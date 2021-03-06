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

	return A.template (
		A.div (
			A.id ('tetoheader'),
			A.img (
				A.id ('tetologo'),
				A.inTitle ('重音テト'),
				A.src ('/img/kasaneteto.png')
			),
			A.alink (
				'https://www.youtube.com/channel/UCnhCFBm4pRI4YEG2S89AVlQ',
				'Kasane Teto Original Songs YouTube channel',
				A.macro (
					A.id ('kasanetetoHeader'),
					'Kasane Teto on YouTube!'
				)
			),
			A.h1 (
				A.id ('tmdpheader'),
				'The Miracle Diva Project'
			),
			A.alink (
				'https://www.youtube.com/watch?v=Q4Lr91Eepvc&index=1&list=PL2Nz7j8k502L_dWrlWm7Wj7wOKf91G2R-',
				'2014/10/10 Teto´s Day Fest playlist',
				A.macro (
					A.id ('notice1010Link'),
					A.target ('_blank'),
					A.span (
						A.id ('notice1010'),
						'Teto´s Day Fest! 2014/10/10',
						A.small (
							'Celebration playlist on YouTube!',
							A.fontawesome ('play-circle-o fa-lg')
						)
					)
				)
			),
			A.img (
				A.id ('kisekinoutahime'),
				A.inTitle ('重音テト・奇跡の歌姫'),
				A.src ('/img/kisekinoutahime.svg')
			)
		),
		A.div (
			A.inClass ('content playlist'),
			getPlaylistSearchTemplate (params),
			A.insert (keys.VIDEO_PAGE_SELECT),
			A.ul (
				A.list (
					keys.VIDEO_PLAYLIST,
					A.li (
						A.alink (
							A.insert (keys.VIDEO_LINK),
							A.insert (keys.VIDEO_LINK),
							A.macro (
								A.target ('_blank'),
								A.img (
									A.src (
										A.insert (keys.VIDEO_THUMBNAIL)
									)
								),
								A.span (
									A.inClass ('vid-pos'),
									A.insert (keys.VIDEO_POSITION)
								),
								A.div (
									A.inClass ('title'),
									A.insert (keys.VIDEO_TITLE)
								)
							)
						)
					)
				)
			),
			A.divClearBoth,
			A.insert (keys.VIDEO_PAGE_SELECT)
		)
	);
}

function getPlaylistSearchTemplate (params) {
	var A = params.appGlobal.A;
	var keys = params.appGlobal.viewKeys;
	var routes = params.routes;

	return A.span (
		A.id ('filter'),
		A.form (
			A.action (routes.showPlaylistSearch),
			A.method ('GET'),
			A.fontawesome ('search'),
			A.textInput (
				'term',
				A.value (A.insert (keys.VIDEO_SEARCH_TERM))
			),
			A.input (
				A.type ('submit'),
				A.value ('Search')
			),
			A.span (
				A.inClass ('note small'),
				'The search includes title and description.'
			)
		),
		A.alink (
			routes.showPlaylistLatest,
			'Return to unfiltered list',
			'Clear search'
		),
		A.divClearBoth
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

			items.push (
				A.span (
					A.inClass ('no-link'),
					page.to
				)
			);

		} else {
			items.push (
				A.alink (
					params.getRoute (page.from, page.to),
						'Show videos '
						+ page.from
						+ ', '
						+ page.to,
					page.to
				)
			);
		}

		items.push (' ');
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
			A.alink (
				routes.resetPlaylistLoader,
				'Reset loader'
			),
			' | ',
			A.alink (
				routes.loadNextPlaylistPage,
				'Load next page'
			)
		)
	);
}

function getTitleLinesView (A, titleLines) {
	return A.string (
		A.template (
			A.list (
				'lines',
				A.div (
					A.inClass (A.insert ('inClass')),
					A.insert ('line')
				)
			)
		),
		{
			lines: titleLines
		}
	);
}

module.exports = {
	getTemplate: getTemplate,
	getPageSelectView: getPageSelectView,
	getLoader: getLoader,
	getTitleLinesView: getTitleLinesView
};
