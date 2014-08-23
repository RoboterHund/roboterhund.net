// common views
'use strict';

var A = require ('april1-html');

var params = require ('./params');

/**
 * common document template
 */
var commonTemplate =
	A.template (
		A.DOCTYPE,
		A.head (
			A.title ('roboterhund.net')
		),
		A.body (
			A.insert (params.CONTENT)
		)
	);

/**
 * title attribute
 */
var inTitle = A.specAttr ('title');

/**
 * link
 */
function link (href, title, text) {
	return A.a (
		A.href (href),
		inTitle (title),
		text
	)
}

module.exports = {
	commonTemplate: commonTemplate,
	link: link
};
