const Playlist = require('./../models/Playlist');

module.exports = (socket, io) => {
  socket.on('USER_LEAVE_PLAYLIST', (playlistData, userObject) => {
    const playlistId = playlistData._id;

    Playlist.findOneAndUpdate({
      '_id': playlistId,
      }, {
        '$pull': {
        'activeUsers': userObject,
        'users': userObject,
      }},
      { new: true },

      (err, doc) => {

        if (err) {
            console.log("Something wrong when updating data!");
        }

      socket.leave(playlistId);
      io.to(playlistId).emit('USER_LEAVE_PLAYLIST', doc);

    });

    console.log(userObject.displayName + ' leaved ' + playlistId);
  });
}
