const User = require('./../models/User');
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi();

const checkToken = require('./../middleware/checkToken');

module.exports = {
  getUser: (req, res, next) => {
    User.findById(req.user.id, (err, user) => {
      res.json(user);
    }).catch((err) => {
      res.send(404);
    });
  },
  getUserToptracks: (req, res, next) => {
    spotifyApi.setAccessToken(req.user.accessToken);

    const getMyTopTracks = () => {
      spotifyApi.getMyTopTracks()
        .then((data) => {
          res.json(data.body);
        }).catch((err) => {
          checkToken(req, res, next, err, spotifyApi, getMyTopTracks);
      });
    }

    getMyTopTracks();
  },
};
