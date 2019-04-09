const express = require('express');
const router = express.Router();
const passport = require('passport');
const ensureAuthenticated = require('./../middleware/ensureAuthenticated');
const User = require('./../models/User');
const Playlist = require('./../models/Playlist');

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

router.get('/api/user', ensureAuthenticated, (req, res) => {
  User.findById(req.user.id, (err, user) => {
    res.json(user);
  });
});

router.get('/api/playlists', ensureAuthenticated, (req, res, next) => {
  Playlist.find({}).sort({
    createdAt: 'desc'
  }).then((results) => {
    res.json(results);
  }).catch((error) => { });
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_URL);
});

module.exports = router;
