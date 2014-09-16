// debug
'use strict';

/**
 * get debug message targets
 * @returns {{}}
 */
function getDebugs () {
	var debug = require ('debug');

	var debugs = {};

	// roboterhund.net debug message targets
	debugs.auth = debug ('rhnet:auth');
	debugs.main = debug ('rhnet:main');
	debugs.tmdp = debug ('rhnet:tmdp');

	return debugs;
}

module.exports = {
	getDebugs: getDebugs
};
