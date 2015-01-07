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
	appGlobal.render = render;

	appGlobal.views = {};

	var mViewsAuth = require ('../views/auth');
	appGlobal.authViews = mViewsAuth.getAuthViews (params);
	appGlobal.views.login =
		mViewsAuth.getLoginView (params);

	var mViewsCommon = require ('../views/common');
	appGlobal.views.rootTemplate =
		mViewsCommon.getCommonTemplate (params);

	appGlobal.styles = {
		rh: A.constant (A.stylesheet ('/css/rh.css'))
	};

	appGlobal.db = params.collections;

	appGlobal.youtube = {};

	appGlobal.f = {
		addScript: mViewsCommon.addScript,
		isAscii: isAsciiString,
		useResultArray: toGetResultArray
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

		req.tempData.rootTemplate = req.appGlobal.views.rootTemplate;

		req.viewVals [appGlobal.viewKeys.STYLE] = appGlobal.styles.rh;
		req.viewVals [appGlobal.viewKeys.SCRIPTS] = [];
		req.viewVals [appGlobal.viewKeys.INIT_SCRIPT] = '';

		next ();
	};
}

/**
 * send rendered view
 */
function render (req, res) {
	res.send (
		req.appGlobal.A.string (
			req.tempData.rootTemplate,
			req.viewVals
		)
	);
}

/**
 * true if all characters in string are ascii
 * @param string
 * @returns {boolean}
 */
function isAsciiString (string) {
	return /^[\000-\177]*$/.test (string);
}

/**
 * convert database result to array
 * @param callback
 * @param next
 * @returns {Function}
 */
function toGetResultArray (callback, next) {
	return function getResultArray (err, result) {
		if (err) {
			next (err);

		} else {
			result.toArray (
				function useResultArray (err, items) {
					if (err) {
						next (err);

					} else {
						callback (items);
					}
				}
			);
		}
	};
}

module.exports = {
	initGlobalData: initGlobalData,
	toInitReq: toInitReq
};
