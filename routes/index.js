const express = require('express');
const router = express.Router();

const auth = require('./auth')(router);
const api = require('./api')(router);

module.exports = router;
