// test routes
'use strict';

/**
 * create a route that always throws an exception
 * (deliberately)
 * @param router
 * @param params
 */
function initFail (router, params) {
	router.get (
		'/fail',
		function (req, res, next) {
			throw new Error ('FAIL!');
		}
	);
}

module.exports = {
	initFail: initFail
};
