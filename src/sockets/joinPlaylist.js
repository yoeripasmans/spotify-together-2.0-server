const Playlist = require('./../models/Playlist');

module.exports = (socket, io, req) => {
  socket.on('USER_JOIN_PLAYLIST', (playlistId) => {
    socket.join(playlistId);
    io.to(playlistId).emit('USER_CONNECT_TO_PLAYLIST');

    Playlist.findOneAndUpdate({
      '_id': playlistId,
      'activeUsers.spotifyId': {
          $ne: req.user.spotifyId
      }},
      { '$push': {
        'activeUsers': req.user,
        'users': req.user,
      }},
      { new: true },

      (err, doc) => {

        if (err) {
            console.log("Something wrong when updating data!");
        }
    });

    console.log(playlistId);
  });
}
