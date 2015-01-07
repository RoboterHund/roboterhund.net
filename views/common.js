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
			A.metaViewportDeviceWidth,
			A.stylesheet (
				'/css/font-awesome-4.2.0/css/font-awesome.min.css'
			),
			A.insert (keys.STYLE),
			A.list (
				keys.SCRIPTS,
				'<script src="',
				A.insert (keys.SCRIPT),
				'" defer></script>'
			)
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
				routes.admin,
				'Admin',
				A.macro (
					A.id ('adminLink'),
					A.fontawesome ('cogs')
				)
			),
			A.footer (
				'roboterhund.net website © 2014 RoboterHund',
				A.br (),
				'All videoclips and songs are copyright to their respective owners and are presented for informational purposes only.',
				A.br (),
				'Kasane Teto © 2008 Sen, Oyamano Mayo, TWINDRILL.'
			)
		)
	);
}

function addScript (req, src) {
	var script = {};
	script [req.appGlobal.viewKeys.SCRIPT] = src;
	req.viewVals [req.appGlobal.viewKeys.SCRIPTS].push (script);
}

module.exports = {
	getCommonTemplate: getCommonTemplate,
	addScript: addScript
};
