require('../config/passport.js');
const passport = require('passport');

module.exports = (router) => {
  router.get('/auth/spotify',
    passport.authenticate('spotify', {
      scope:
      `streaming
      user-read-birthdate
      user-read-private
      playlist-read-private
      user-read-email
      user-read-playback-state
      user-modify-playback-state
      user-top-read`,
      showDialog: false,
    }));

  router.get('/callback',
    passport.authenticate('spotify', { failureRedirect: process.env.CLIENT_URL }),
    (req, res) => {
      res.redirect(process.env.CLIENT_URL);
    }
  );

  router.get('/logout', (req, res) => {
    req.logout();
    res.redirect(process.env.CLIENT_URL);
  });
};
