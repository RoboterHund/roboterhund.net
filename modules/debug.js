// debug messages targets
'use strict';

/**
 *
 * @param debugTarget
 * @param name
 * @returns {*}
 */
function newDebugTarget (debugTarget, name) {
	return debugTarget ('RoboterhundNet:' + name);
}

/**
 *
 * @returns {*}
 */
function debugs () {
	var debugTarget = require ('debug');

	return {
		main: newDebugTarget (debugTarget, 'main'),
		auth: newDebugTarget (debugTarget, 'auth')
	};
}

module.exports = {
	debugs: debugs
};
