const Playlist = require('./../models/Playlist');

module.exports = {
  getAll: (req, res) => {
    Playlist.find({}).sort({ createdAt: 'desc' })
    .then((results) => {
      res.json(results);
    }).catch((error) => {
      res.send(404)
    });
  },
  getPlaylist: (req, res) => {
    Playlist.findById(req.params.id)
    .then((results) => {
      res.json(results);
    }).catch((error) => {
      res.send(404)
    });
  },
};
