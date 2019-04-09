var router = require('express').Router();

const auth = require('./auth')(router);
const api = require('./api')(router);

module.exports = router;
