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
	var A = mViewsTemplates.getTemplateEngine ();
	appGlobal.A = A;
	appGlobal.viewKeys = keys;
	appGlobal.views = {};
	appGlobal.render = toRender (params);

	appGlobal.styles = {
		rh: A.constant (A.stylesheet ('/css/rh.css'))
	};

	appGlobal.db = params.collections;

	appGlobal.youtube = {};

	appGlobal.f = {
		isAscii: isAsciiString
	};

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

		req.viewVals [appGlobal.viewKeys.STYLE] = appGlobal.styles.rh;

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

/**
 * true if all characters in string are ascii
 * @param string
 * @returns {boolean}
 */
function isAsciiString (string) {
	return /^[\000-\177]*$/.test (string);
}

module.exports = {
	initGlobalData: initGlobalData,
	toInitReq: toInitReq
};
