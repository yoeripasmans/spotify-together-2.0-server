const socketio = require('socket.io');

module.exports.listen = (app) => {
  const io = socketio.listen(app);
  io.set('transports', ['websocket']);
  io.on('connection', (socket) => {

    socket.on('USER_CONNECTED', (userData) => {
      console.log(userData.spotifyId,'connected');
    });

    require('./joinPlaylist')(socket, io);
    require('./leavePlaylist')(socket, io);
  });
}
