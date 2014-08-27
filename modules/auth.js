// authentication
'use strict';

var url = require ('url');

var FacebookStrategy = require ('passport-facebook').Strategy;
//var GithubStrategy = require ('passport-github').Strategy;
//var GoogleStrategy = require ('passport-google').Strategy;
//var TwitterStrategy = require ('passport-twitter').Strategy;

var authParams = require ('../private/auth');
var dbConfig = require ('../private/db');

var usersCollection = dbConfig.collections.users;

/**
 *
 * @param app
 * @param passport
 * @param host
 * @param map
 * @param db
 * @param debug
 */
function usePassport (app, passport, host, map, db, debug) {
	app.use (passport.initialize ());
	app.use (passport.session ());

	passport.serializeUser (serializeUser);
	passport.deserializeUser (toDeserializeUser (db, debug));

	var check = toCheckUser (db, debug);
	useFacebookStrategy (passport, check, host, map);
}

/**
 *
 * @param passport
 * @param check
 * @param host
 * @param map
 */
function useFacebookStrategy (passport, check, host, map) {
	passport.use (
		new FacebookStrategy (
			{
				clientID: authParams.facebook.id,
				clientSecret: authParams.facebook.secret,
				callbackURL: url.resolve (
					host,
					map.root.login.facebook.back.ROUTE
				)
			},
			function (accessToken, refreshToken, profile, done) {
				check ('Facebook', profile, done);
			}
		)
	);
}

/**
 *
 * @param user
 * @param done
 */
function serializeUser (user, done) {
	done (null, user._id);
}

/**
 *
 * @param db
 * @param debug
 * @returns {Function}
 */
function toDeserializeUser (db, debug) {
	return function deserializeUser (id, done) {
		db.collection (
			usersCollection
		).findOne (
			{
				_id: id
			},
			toUserFound (id, done, debug)
		);
	};
}

/**
 *
 * @param id
 * @param done
 * @param debug
 * @returns {Function}
 */
function toUserFound (id, done, debug) {
	return function userFound (err, user) {
		if (err) {
			debug ('failed to find user ' + id);
			done (err, null);

		} else {
			done (null, user);
		}
	};
}

/**
 *
 * @param db
 * @param debug
 * @returns {Function}
 */
function toCheckUser (db, debug) {
	return function checkUser (from, profile, done) {
		db.collection (
			usersCollection
		).findOne (
			{
				from: from,
				authId: profile.id
			},
			toRegisterUser (from, profile, done, db, debug)
		);
	};
}

/**
 *
 * @param from
 * @param profile
 * @param done
 * @param db
 * @param debug
 * @returns {Function}
 */
function toRegisterUser (from, profile, done, db, debug) {
	return function registerUser (err, user) {
		if (err) {
			debug (err);

		} else if (user !== null) {
			done (null, user);

		} else {
			db.collection (
				usersCollection
			).insert (
				{
					from: from,
					authId: profile.id,
					created: Date.now (),
					data: profile
				},
				toUserInserted (profile, done, debug)
			);
		}
	};
}

/**
 *
 * @param profile
 * @param done
 * @param debug
 * @returns {Function}
 */
function toUserInserted (profile, done, debug) {
	return function userInserted (err, result) {
		if (err) {
			debug (err);
			done (err, null);

		} else {
			debug (
				"user added; id: '%s', name; '%s' result: '%s'",
				profile.id,
				profile.displayName,
				JSON.stringify (result)
			);
			done (null, result [0]);
		}
	};
}

module.exports = {
	usePassport: usePassport
};
