// admin views
'use strict';

function getAdminView (appGlobal) {
	var A = appGlobal.A;
	var keys = appGlobal.viewKeys;
	var routes = appGlobal.routes;

	return A.template (
		A.h1 ('Admin panel'),
		A.h2 ('Refresh Kasane Teto playlist'),
		A.div (
			A.alink (
				routes.loadLatestPlaylistPage,
				'Reload latest ≤50 videos. '
			)
		)
	);
}

module.exports = {
	getAdminView: getAdminView
};
