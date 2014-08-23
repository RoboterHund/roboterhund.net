// common content
'use strict';

var A = require ('april1-html');

var mViewsCommon = require ('../views/common');

/**
 * common route handler
 * @param db
 * @returns {Function}
 */
function init (db) {
	return function doInit (req, res, next) {
		req.db = db;
		req.viewParams = {};
		next ();
	};
}

/**
 *
 * @param req
 * @param res
 */
function render (req, res) {
	res.send (
		A.string (
			mViewsCommon.commonTemplate,
			req.viewParams
		)
	);
}

module.exports = {
	init: init,
	render: render
};
