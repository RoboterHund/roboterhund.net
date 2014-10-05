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
				'https://twitter.com/RoboterHund87',
				'my Twitter',
				'RoboterHund'
			),
			' is building a node.js server.'
		)
	);
}

module.exports = {
	getHomeView: getHomeView
};
