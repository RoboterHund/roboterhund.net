// common route handlers
'use strict';

/**
 * initialize request with common parameters
 * @param appGlobal
 * @returns {init}
 */
function toInit (appGlobal) {
	return function init (req, res, next) {
		req.appGlobal = appGlobal;
		req.tempData = {};
		req.viewVals = {};

		next ();
	};
}

/**
 * send rendered view
 * @returns {render}
 */
function toRender (params) {
	var mViewsCommon = require ('../views/common');
	params.appGlobal.views.rootTemplate =
		mViewsCommon.getCommonTemplate (params);

	return function render (req, res) {
		res.send (
			req.appGlobal.A.string (
				req.appGlobal.views.rootTemplate,
				req.viewVals
			)
		);
	};
}

module.exports = {
	toInit: toInit,
	toRender: toRender
};
