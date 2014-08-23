// public content
'use strict';

var mPublic = require ('../views/public');
var params = require ('../views/params');

/**
 * root Express route handler
 * @param req
 * @param res
 * @param next
 */
function root (req, res, next) {
	req.viewParams [params.CONTENT] = mPublic.root;
	next ();
}

module.exports = {
	root: root
};
