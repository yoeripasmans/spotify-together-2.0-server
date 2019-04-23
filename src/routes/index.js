module.exports = (io) => {
  const router = require('express').Router();
  const auth = require('./auth')(router);
  const api = require('./api')(router, io);
  return router;
};
