// global data
'use strict';

/**
 * initialize global data
 * @param params
 * @returns {{}}
 */
function initGlobalData (params) {
	var data = {};
	params.appGlobal = data;

	data.debugs = params.debugs;

	var mViewsTemplates = require ('../views/templates');
	var keys = require ('../views/keys');
	var mContentCommon = require ('../content/common');
	data.A = mViewsTemplates.getTemplateEngine ();
	data.viewKeys = keys;
	data.views = {};
	data.render = mContentCommon.toRender (params);

	data.db = params.collections;

	data.youtube = {};

	return data;
}

module.exports = {
	initGlobalData: initGlobalData
};
