// common content
'use strict';

var A = require ('april1-html');

var pmDbParams = require ('../private/db');

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
 * @param debug
 * @returns {Function}
 */
function toCheckAuth (debug) {
	return function checkAuth (req, res, next) {
		if (req.isAuthenticated ()) {
			req.viewParams [params.CONT_USER] =
				mViewsAuth.authUser;

			var userId = req.session.passport.user;
			req.db.collection (
				pmDbParams.collections.users
			).findOne (
				{
					_id: userId
				},
				toAuthUserFound (req, userId, next, debug)
			);

			req.viewParams [params.LOGIN_CONTROL] = mViewsAuth.logout;

		} else {
			req.viewParams [params.CONT_USER] =
				mViewsAuth.noAuthUser;
			req.viewParams [params.LOGIN_CONTROL] = mViewsAuth.login;
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
