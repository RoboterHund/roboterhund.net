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
	 * target attribute
	 * @type {Function}
	 */
	A.target = A.specAttr ('target');

	/**
	 * link
	 * @param href
	 * @param title
	 * @param text
	 * @returns {*}
	 */
	A.alink = function (href, title, text) {
		if (!text) {
			text = title;
		}
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
		return A.link (
			A.rel ('stylesheet'),
			A.href (path)
		);
	};

	/**
	 * textbox
	 */
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

	/**
	 * Font Awesome icon
	 */
	A.fontawesome = function (icon, also) {
		return A.span (
			A.inClass ('fa fa-' + icon),
			also ? also : A.macro (),
			''
		);
	};

	/**
	 * empty div to clear float
	 */
	A.divClearBoth = A.constant (
		A.div (A.inStyle ('clear:both'), '')
	);

	/**
	 * for CSS3 media queries
	 * @type {string}
	 */
	A.metaViewportDeviceWidth =
		'<meta name="viewport" content="width=device-width" />';

	return A;
}

module.exports = {
	getTemplateEngine: getTemplateEngine
};
