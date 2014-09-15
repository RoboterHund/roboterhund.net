// common views
'use strict';

/**
 * common template
 * @returns {*}
 */
function getCommonTemplate (params) {
	var A = params.appGlobal.A;
	var keys = params.appGlobal.viewKeys;
	var routes = params.routes;

	return A.template (
		A.DOCTYPE,
		A.head (
			A.title ('roboterhund.net')
		),
		A.body (
			A.insert (keys.CONTENT),
			A.hr (),
			A.link (
				routes.root,
				'Home',
				'Home'
			),
			' | ',
			A.link (
				routes.showPlaylist,
				'The Miracle Diva Project',
				'Kasane Teto playlist'
			),
			A.p (
				'© 2014 RoboterHund'
			)
		)
	);
}

module.exports = {
	getCommonTemplate: getCommonTemplate
};