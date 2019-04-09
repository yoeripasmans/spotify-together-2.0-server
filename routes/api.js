const playlistController = require('./../controllers/playlist.ctrl');
const userController = require('./../controllers/user.ctrl');
const ensureAuthenticated = require('./../middleware/ensureAuthenticated');

module.exports = (router) => {
  router
    .route('/api/playlists')
    .get(ensureAuthenticated, playlistController.getAll);

  router
    .route('/api/playlist/:id')
    .get(ensureAuthenticated, playlistController.getPlaylist);

  router
    .route('/api/user')
    .get(ensureAuthenticated, userController.getUser);
};
