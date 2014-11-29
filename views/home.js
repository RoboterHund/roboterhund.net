// home views
'use strict';

/**
 * get home view
 */
function getHomeView (params) {
	var A = params.appGlobal.A;

	return A.constant (
		A.h1 (
			'The Web Territory of RoboterHund'
		),
		A.p (
			A.alink (
				'https://github.com/RoboterHund',
				'my GitHub account',
				A.macro (
					A.target ('_blank'),
					'RoboterHund'
				)
			),
			' (',
			A.span (
				A.inStyle ('color: yellow;'),
				'Alexander Díaz Chub'
			),
				') built the '
				+ 'node.js server that serves this website, '
				+ 'and is still working on it from time to time :P'
		),
		A.p (
			'This website hosts the searchable and easy-to-access ',
			A.alink (
				params.appGlobal.routes.showPlaylistLatest,
				'The Miracle Diva Project original songs playlist'
			),
			'.'
		)
	);
}

module.exports = {
	getHomeView: getHomeView
};
