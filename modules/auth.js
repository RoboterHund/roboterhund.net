// authentication
'use strict';

var url = require ('url');


/**
 *
 * @param app
 * @param passport
 * @param config
 * @param db
 */
function usePassport (app, passport, config, db) {
	app.use (passport.initialize ());
	app.use (passport.session ());

	passport.serializeUser (serializeUser);
	passport.deserializeUser (toDeserializeUser (db, config));

	var check = toCheckUser (db, config);
	useFacebookStrategy (passport, check, config);
	useGithubStrategy (passport, check, config);
	useGoogleStrategy (passport, check, config);
	useTwitterStrategy (passport, check, config);
}

/**
 *
 * @param passport
 * @param check
 * @param config
 */
function useFacebookStrategy (passport, check, config) {
	var FacebookStrategy = require ('passport-facebook').Strategy;

	passport.use (
		new FacebookStrategy (
			{
				clientID: config.private.auth.facebook.id,
				clientSecret: config.private.auth.facebook.secret,
				callbackURL: url.resolve (
					config.host,
					config.root.login.facebook.back.ROUTE
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
 * @param passport
 * @param check
 * @param config
 */
function useGithubStrategy (passport, check, config) {
	var GithubStrategy = require ('passport-github').Strategy;

	passport.use (
		new GithubStrategy (
			{
				clientID: config.private.auth.github.id,
				clientSecret: config.private.auth.github.secret,
				callbackURL: url.resolve (
					config.host,
					config.root.login.github.back.ROUTE
				)
			},
			function (accessToken, refreshToken, profile, done) {
				check ('GitHub', profile, done);
			}
		)
	);
}

/**
 *
 * @param passport
 * @param check
 * @param config
 */
function useGoogleStrategy (passport, check, config) {
	var GoogleStrategy = require ('passport-google').Strategy;

	passport.use (
		new GoogleStrategy (
			{
				returnURL: url.resolve (
					config.host,
					config.root.login.google.back.ROUTE
				),
				realm: config.host
			},
			function (identifier, profile, done) {
				check ('Google', profile, done);
			}
		)
	);

}

/**
 *
 * @param passport
 * @param check
 * @param config
 */
function useTwitterStrategy (passport, check, config) {
	var TwitterStrategy = require ('passport-twitter').Strategy;

	passport.use (
		new TwitterStrategy (
			{
				consumerKey: config.private.auth.twitter.key,
				consumerSecret: config.private.auth.twitter.secret,
				callbackURL: url.resolve (
					config.host,
					config.root.login.twitter.back.ROUTE
				)
			},
			function (accessToken, refreshToken, profile, done) {
				check ('Twitter', profile, done);
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
 * @param config
 * @returns {Function}
 */
function toDeserializeUser (db, config) {
	var debug = config.debugs.auth ();

	return function deserializeUser (id, done) {
		db.collection (
			config.private.db.collections.users
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
 * @param config
 * @returns {Function}
 */
function toCheckUser (db, config) {
	var debug = config.debugs.auth;

	return function checkUser (from, profile, done) {
		db.collection (
			config.private.db.collections.users
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
				config.private.db.collections.users
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
