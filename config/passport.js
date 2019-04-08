const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const User = require('./../models/User');

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => {
			done(err, user);
		});
	});

  passport.use(
    new SpotifyStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: 'http://localhost:3001/callback',
      },
      (accessToken, refreshToken, expires_in, profile, done) => {
        User.findOrCreate({ spotifyId: profile.id }, (err, user) => {
          return done(err, user);
        });
      }
    )
  );
