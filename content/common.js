// common content
'use strict';

var A = require ('april1-html');

var mViewsCommon = require ('../views/common');
var mViewsAuth = require ('../views/auth');
var params = require ('../views/params');

/**
 * common route handler
 * @param db
 * @returns {Function}
 */
function toInit (db) {
	return function init (req, res, next) {
		req.db = db;
		req.viewParams = {};

		next ();
	};
}

/**
 *
 * @param config
 * @returns {Function}
 */
function toCheckAuth (config) {
	var authViews = mViewsAuth.views (config);
	var debug = config.debugs.auth;

	return function checkAuth (req, res, next) {
		if (req.isAuthenticated ()) {
			req.viewParams [params.CONT_USER] = authViews.authUser;
			req.viewParams [params.LOGIN_CONTROL] = authViews.logout;

			var userId = req.session.passport.user;

			req.db.collection (
				config.private.db.collections.users
			).findOne (
				{
					_id: userId
				},
				toAuthUserFound (req, userId, next, debug)
			);

		} else {
			req.viewParams [params.CONT_USER] = authViews.noAuthUser;
			req.viewParams [params.LOGIN_CONTROL] = authViews.login;

			next ();
		}
	};
}

function toAuthUserFound (req, id, next, debug) {
	return function authUserFound (err, user) {
		if (err) {
			debug ('failed to find user ' + id);
			next (err);

		} else {
			req.viewParams [params.AUTH_USER] = user.data.displayName;
			req.viewParams [params.USER_FROM] = user.from;
			next ();
		}
	};
}

/**
 *
 * @param req
 * @param res
 */
function render (req, res) {
	res.send (
		A.string (
			mViewsCommon.commonTemplate,
			req.viewParams
		)
	);
}

module.exports = {
	toInit: toInit,
	toCheckAuth: toCheckAuth,
	render: render
};
