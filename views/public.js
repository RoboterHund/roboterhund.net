// public views
'use strict';

var A = require ('april1-html');

var mCommon = require ('../views/common');

/**
 * root view
 */
var root = A.string (
	A.template (
		A.p (
			mCommon.link (
				'https://twitter.com/RoboterHund87',
				'my Twitter',
				'RoboterHund'
			),
			' is building a node.js server.'
		)
	),
	{}
);

module.exports = {
	root: root
};
