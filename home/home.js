// home page
'use strict';

/**
 * set home page as page content
 * @param req
 * @param res
 * @param next
 */
function homePage (req, res, next) {
	var keys = req.appGlobal.viewKeys;

	req.viewVals [keys.CONTENT] = req.appGlobal.views.home;

	next ();
}

module.exports = {
	homePage: homePage
};
