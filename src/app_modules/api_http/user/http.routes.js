'use strict';
const express = require('express');
const router = express.Router();

/**
 * TODO: Describe router function
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
