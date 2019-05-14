const refresh = require('passport-oauth2-refresh');
const User = require('./../models/User');

module.exports = (req, res, next, err, spotifyApi, callback) => {
  if (err.statusCode === 401) {
    // Access token expired
    refresh.requestNewAccessToken('spotify', req.user.refreshToken, (err, newAccessToken) => {
      if (err || !newAccessToken) {
        console.log('no accestoken');
      } else {
        //Update the acces token in database
        User.findOneAndUpdate({
          "spotifyId": req.user.spotifyId
        }, {
          $set: {
            "accessToken": newAccessToken
          }
        }, (err) => {
          if (err) {
            console.log(err);
          }

        });
        // Save the new access token for future use
        req.user.save({
          accessToken: newAccessToken
        }, () => {
          spotifyApi.setAccessToken(newAccessToken);
          // Retry the request.
          callback();
        });
      }
    });
  } else {
    next();
  }
};
