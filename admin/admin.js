// TMDP admin
'use strict';

function showAdminPanel (req, res, next) {
	var appGlobal = req.appGlobal;

	var keys = appGlobal.viewKeys;
	var views = appGlobal.views;

	if (!views.admin) {
		var viewsAdmin = require ('../views/admin');

		views.admin = viewsAdmin.getAdminView (req.appGlobal);
	}

	req.viewVals [keys.CONTENT] = views.admin;

	next ();
}

module.exports = {
	showAdminPanel: showAdminPanel
};
