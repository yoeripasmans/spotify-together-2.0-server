const socketio = require('socket.io');

module.exports.listen = (app) => {
  io = socketio.listen(app);
  io.set('transports', ['websocket']);
  io.on('connection', (socket) => {

    socket.on('USER_CONNECTED', (userData) => {
      console.log(userData.spotifyId,'connected');
    });

    require('./joinPlaylist')(socket, io);
  });
}
