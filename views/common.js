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
			A.title ('roboterhund.net'),
			A.stylesheet (
				'/css/font-awesome-4.2.0/css/font-awesome.min.css'
			),
			A.stylesheet ('/css/main.css')
		),
		A.body (
			A.insert (keys.CONTENT),
			A.div (
				A.inClass ('main-nav'),
				A.alink (
					routes.root,
					'Home'
				),
				A.alink (
					routes.showPlaylistLatest,
					'The Miracle Diva Project',
					'Kasane Teto playlist'
				)
			),
			A.alink (
				routes.login,
				'Admin',
				A.macro (
					A.id ('adminLink'),
					A.fontawesome ('cogs')
				)
			),
			A.footer (
				'© 2014 RoboterHund'
			)
		)
	);
}

module.exports = {
	getCommonTemplate: getCommonTemplate
};
