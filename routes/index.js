const path = require('path');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const ensureAuthenticated = require('./../middleware/ensureAuthenticated');

router.get('/auth/spotify',
  passport.authenticate('spotify', {
    scope: ['user-read-email', 'user-read-private'],
    showDialog: true,
  }),
 (req, res) => {
    // The request will be redirected to spotify for authentication, so this
    // function will not be called.
  }
);

router.get('/api/user', ensureAuthenticated, (req, res) => {
  res.send(req.user);
});

router.get('/callback',
  passport.authenticate('spotify', { failureRedirect: 'http://localhost:3000' }),
  function (req, res) {
    console.log(req.user);
    res.redirect('http://localhost:3000');
  }
);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
