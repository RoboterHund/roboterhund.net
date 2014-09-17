// template engine
'use strict';

/**
 * get extended april1-html template engine
 */
function getTemplateEngine () {
	var A = require ('april1-html');

	/**
	 * link tag
	 * @type {Function}
	 */
	A.tLink = A.specTag ('link');

	/**
	 * rel attribute
	 * @type {Function}
	 */
	A.rel = A.specAttr ('rel');

	/**
	 * title attribute
	 * @type {Function}
	 */
	A.inTitle = A.specAttr ('title');

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

	/**
	 * stylesheet
	 */
	A.stylesheet = function (path) {
		return A.tLink (
			A.rel ('stylesheet'),
			A.href (path)
		);
	};

	return A;
}

module.exports = {
	getTemplateEngine: getTemplateEngine
};
