// user authentication
'use strict';

/**
 * make express app use passport module
 * @param params
 */
function usePassport (params) {
	var app = params.app;

	var passport = require ('passport');

	app.use (
		params.routes.root,
		passport.initialize ()
	);
	app.use (
		params.routes.root,
		passport.session ()
	);

	var debug = params.debugs.auth;
	var users = params.collections.users;

	passport.serializeUser (serializeUser);
	passport.deserializeUser (toDeserializeUser (users, debug));

	var check = toCheckUser (users, debug);
	var authParams = require ('../private/auth');
	if (authParams.facebook.enabled) {
		useFacebookStrategy (passport, check, params);
	}
	if (authParams.github.enabled) {
		useGithubStrategy (passport, check, params);
	}
	if (authParams.google.enabled) {
		useGoogleStrategy (passport, check, params);
	}
	if (authParams.twitter.enabled) {
		useTwitterStrategy (passport, check, params);
	}
}

/**
 * use Facebook passport strategy
 * @param passport
 * @param check
 * @param params
 */
function useFacebookStrategy (passport, check, params) {
	var url = require ('url');
	var secret = require ('../private/auth');
	var FacebookStrategy = require ('passport-facebook').Strategy;

	passport.use (
		new FacebookStrategy (
			{
				clientID: secret.facebook.id,
				clientSecret: secret.facebook.secret,
				callbackURL: url.resolve (
					params.host,
					params.routes.facebookBack
				)
			},
			function (accessToken, refreshToken, profile, done) {
				check ('Facebook', profile, done);
			}
		)
	);
}

/**
 * use GitHub passport strategy
 * @param passport
 * @param check
 * @param params
 */
function useGithubStrategy (passport, check, params) {
	var url = require ('url');
	var secret = require ('../private/auth');
	var GithubStrategy = require ('passport-github').Strategy;

	passport.use (
		new GithubStrategy (
			{
				clientID: secret.github.id,
				clientSecret: secret.github.secret,
				callbackURL: url.resolve (
					params.host,
					params.routes.githubBack
				)
			},
			function (accessToken, refreshToken, profile, done) {
				check ('GitHub', profile, done);
			}
		)
	);
}

/**
 * use Google passport strategy
 * @param passport
 * @param check
 * @param params
 */
function useGoogleStrategy (passport, check, params) {
	var url = require ('url');
	var GoogleStrategy = require ('passport-google').Strategy;

	passport.use (
		new GoogleStrategy (
			{
				returnURL: url.resolve (
					params.host,
					params.routes.googleBack
				),
				realm: params.host
			},
			function (identifier, profile, done) {
				check ('Google', profile, done);
			}
		)
	);

}

/**
 * use Twitter passport strategy
 * @param passport
 * @param check
 * @param params
 */
function useTwitterStrategy (passport, check, params) {
	var url = require ('url');
	var secret = require ('../private/auth');
	var TwitterStrategy = require ('passport-twitter').Strategy;

	passport.use (
		new TwitterStrategy (
			{
				consumerKey: secret.twitter.key,
				consumerSecret: secret.twitter.secret,
				callbackURL: url.resolve (
					params.host,
					params.routes.twitterBack
				)
			},
			function (accessToken, refreshToken, profile, done) {
				check ('Twitter', profile, done);
			}
		)
	);
}

/**
 * serialize user
 * @param user
 * @param done
 */
function serializeUser (user, done) {
	done (null, user._id);
}

/**
 * deserialize user
 * @param users
 * @param debug
 * @returns {Function}
 */
function toDeserializeUser (users, debug) {

	return function deserializeUser (id, done) {
		users ().findOne (
			{
				_id: id
			},
			function userFound (err, user) {
				if (err) {
					debug ('failed to find user ' + id);
					done (err, null);

				} else {
					done (null, user);
				}
			}
		);
	};
}

/**
 * insert new users in users collection
 * @param users
 * @param debug
 * @returns {Function}
 */
function toCheckUser (users, debug) {
	return function checkUser (from, profile, done) {
		users ().findOne (
			{
				from: from,
				authId: profile.id
			},

			function registerUser (findUserErr, user) {
				if (findUserErr) {
					debug (findUserErr);

				} else if (user !== null) {
					done (null, user);

				} else {
					users ().insert (
						{
							from: from,
							authId: profile.id,
							created: Date.now (),
							data: profile
						},

						function userInserted (insertUserErr, result) {
							if (insertUserErr) {
								debug (insertUserErr);
								done (insertUserErr, null);

							} else {
								debug (
									"user added; id: '%s', name; '%s' result: '%s'",
									profile.id,
									profile.displayName,
									JSON.stringify (result)
								);
								done (null, result [0]);
							}
						}
					);
				}
			}
		);
	};
}

/**
 * logout user
 * @param req
 * @param res
 * @param next
 */
function logout (req, res, next) {
	req.logout ();
	res.redirect (req.appGlobal.routes.login);
}

module.exports = {
	usePassport: usePassport,
	logout: logout
};
