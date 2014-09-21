// template engine
'use strict';

/**
 * get extended april1-html template engine
 */
function getTemplateEngine () {
	var A = require ('april1-html');

	A.header = A.specTag ('header');
	A.footer = A.specTag ('footer');

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
	 * action attribute
	 * @type {Function}
	 */
	A.action = A.specAttr ('action');

	/**
	 * method attribute
	 * @type {Function}
	 */
	A.method = A.specAttr ('method');

	/**
	 * value attribute
	 * @type {Function}
	 */
	A.value = A.specAttr ('value');

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

	A.textInput = function (name) {
		var args = [
			A.type ('text'),
			A.name (name)
		];
		var i;
		var n = arguments.length;
		for (i = 1; i < n; i++) {
			args.push (arguments [i]);
		}
		return A.input.apply (null, args);
	};

	return A;
}

module.exports = {
	getTemplateEngine: getTemplateEngine
};
