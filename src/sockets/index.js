const socketio = require('socket.io');

module.exports.listen = (app) => {
  const io = socketio.listen(app);
  io.set('transports', ['websocket']);
  io.on('connection', (socket) => {

    console.log('socket connected');

    socket.on('disconnect', () => {
       console.log('user disconnected');
    });

    require('./joinPlaylist')(socket, io);
    require('./leavePlaylist')(socket, io);
  });
}
