// global data
'use strict';

/**
 * initialize global data
 * @param params
 * @returns {{}}
 */
function initGlobalData (params) {
	var appGlobal = {};
	params.appGlobal = appGlobal;

	appGlobal.debugs = params.debugs;
	appGlobal.routes = params.routes;

	var mViewsTemplates = require ('../views/templates');
	var keys = require ('../views/keys');
	appGlobal.A = mViewsTemplates.getTemplateEngine ();
	appGlobal.viewKeys = keys;
	appGlobal.views = {};
	appGlobal.render = toRender (params);

	appGlobal.db = params.collections;

	appGlobal.youtube = {};

	return appGlobal;
}

/**
 * initialize request with common parameters
 * @param appGlobal
 * @returns {Function}
 */
function toInitReq (appGlobal) {
	return function initReq (req, res, next) {
		req.appGlobal = appGlobal;
		req.tempData = {};
		req.viewVals = {};

		next ();
	};
}

/**
 * send rendered view
 * @returns {Function}
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
	initGlobalData: initGlobalData,
	toInitReq: toInitReq
};
