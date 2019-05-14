const passport = require('passport');
const refresh = require('passport-oauth2-refresh');
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

const strategy = new SpotifyStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.REDIRECT_URI,
  },
  (accessToken, refreshToken, expires_in, profile, done) => {
    User.findOrCreate({
      spotifyId: profile.id,
      displayName: profile.displayName,
      username: profile.username,
      email: profile.emails[0].value,
      profilePic: profile.photos[0],
      country: profile.country,
      followers: profile.followers,
      birthdate: profile._json.birthdate,
      product: profile.product,
      accessToken: accessToken,
      refreshToken: refreshToken,
    }, (err, user) => {
      return done(err, user);
    });
  }
)

passport.use(strategy);
refresh.use(strategy);
