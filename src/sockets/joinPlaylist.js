const Playlist = require('./../models/Playlist');

module.exports = (socket, io) => {
  socket.on('USER_JOIN_PLAYLIST', (playlistData, userData) => {
    const playlistId = playlistData._id;

    Playlist.findOneAndUpdate({
      '_id': playlistId,
      'activeUsers.spotifyId': {
          $ne: userData.spotifyId
      }},
      { '$push': {
        'activeUsers': userData,
        'users': userData,
      }},

      (err, doc) => {

        if (err) {
            console.log("Something wrong when updating data!");
        }

        Playlist.findById(playlistId, (err, doc) => {
            if (err) {
              console.log("Something wrong when getting the data!");
            }
            socket.join(playlistId);
            console.log(userData.displayName + ' joined ' + playlistId);
            io.to(playlistId).emit('USER_JOIN_PLAYLIST', doc);
        });  
    });
  });
}
