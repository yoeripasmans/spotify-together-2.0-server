const Playlist = require('./../models/Playlist');

module.exports = {
    getAll: (req, res, next) => {
      Playlist.find({}).sort({
        createdAt: 'desc'
      }).then((results) => {
        res.json(results);
      }).catch((error) => {
        res.send(404)
      });
    },
    getPlaylist: (req, res, next) => {
        Playlist.findById(req.params.id).exec((err, playlist) => {
            if (err) {
                res.send(err);
            } else if (!playlist) {
                res.send(404);
            } else {
                res.send(playlist);
            }
            next();
        });
    },
};
