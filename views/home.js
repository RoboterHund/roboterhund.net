// home views
'use strict';

/**
 * get home view
 */
function getHomeView (params) {
	var A = params.appGlobal.A;

	return A.constant (
		A.header (
			'The Web Territory of RoboterHund'
		),
		A.p (
			A.link (
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
