const playlistController = require('./../controllers/playlist.ctrl');
const userController = require('./../controllers/user.ctrl');
const ensureAuthenticated = require('./../middleware/ensureAuthenticated');

module.exports = (router, io) => {
  router
    .route('/api/playlists')
    .get(ensureAuthenticated, playlistController.getAll);

  router
    .route('/api/playlist/:id')
    .get(ensureAuthenticated, playlistController.getPlaylist);

  router
    .route('/api/me')
    .get(ensureAuthenticated, userController.getUser);

  router
    .route('/api/me/toptracks')
    .get(ensureAuthenticated, userController.getUserToptracks);

  io.on('connection', (socket) => {
    socket.on('USER_CONNECTED', (data) => {
     console.log(data);
   });

   socket.on('join', (room) => {
     socket.join(room);
   });

  });
};
