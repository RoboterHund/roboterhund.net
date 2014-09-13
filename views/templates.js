// template engine
'use strict';

/**
 * get extended april1-html template engine
 */
function getTemplateEngine () {
	var A = require ('april1-html');

	/**
	 * title attribute
	 * @type {Function}
	 */
	A.inTitle = require ('april1-html').specAttr ('title');

	/**
	 * link
	 * @param href
	 * @param title
	 * @param text
	 * @returns {*}
	 */
	A.link = function (href, title, text) {
		return A.a (
			A.href (href),
			A.inTitle (title),
			text
		);
	};

	/**
	 * constant string
	 * @returns {string}
	 */
	A.constant = function () {
		return A.string (
			A.template.apply (null, arguments),
			{}
		);
	};

	return A;
}

module.exports = {
	getTemplateEngine: getTemplateEngine
};
