// admin views
'use strict';

function getAdminView (appGlobal) {
	var A = appGlobal.A;
	var keys = appGlobal.viewKeys;
	var routes = appGlobal.routes;

	return A.template (
		A.h1 ('Admin panel'),
		A.h2 ('User authentication'),
		A.p (
			A.em (
				A.inClass ('note small'),
				A.fontawesome ('warning'),
				' Authentication does not enable restricted operations.'
			)
		),
		A.p (
			A.insert (keys.CONT_USER),
			A.insert (keys.LOGIN_CONTROL)
		),
		A.h2 ('Refresh list'),
		A.div (
			A.alink (
				routes.loadLatestPlaylistPage,
				'Reload latest ≤50 videos. '
			),
			A.em (
				A.inClass ('note small'),
				' ',
				A.fontawesome ('ban'),
				' Restricted operation.'
			)
		)
	);
}

module.exports = {
	getAdminView: getAdminView
};
