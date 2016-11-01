'use strict';
const express = require('express');
const router = express.Router();

/**
 * This export defines what routes are available on USER
 *  POST to /create to create a new user
 *  GET to /:id to return a specific user
 *
 * @param req
 * @param res
 * @param app
 * @returns {*}
 */
module.exports = function(req, res, app) {
  router.post('/', require('./create')(req, res, app));
  router.get('/:id', require('./login')(req, res, app));
  return router;
};
