const express = require('express');
const router = express.Router();
const passport = require('passport');
const ensureAuthenticated = require('./../middleware/ensureAuthenticated');
const User = require('./../models/User');

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
    showDialog: true,
  }));

router.get('/callback',
  passport.authenticate('spotify', { failureRedirect: 'http://localhost:3000' }),
  (req, res) => {
    res.redirect('http://localhost:3000/');
  }
);

router.get('/api/user', ensureAuthenticated, (req, res) => {
  User.findById(req.user.id, (err, user) => {
    res.json(user);
  });
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('http://localhost:3000/');
});

module.exports = router;
