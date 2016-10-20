'use strict';

const express = require('express')();
const compress = require('compression');
const bodyParser = require('body-parser');
const cors = require('cors');

/**
 * TODO: Describe the express module
 * @name express
 */
module.exports = function(app) {
  express.use(compress({threshold: 1024}));
  express.use(bodyParser.urlencoded({extended: true}));
  express.use(bodyParser.json({limit: '1mb'}));
  express.use(bodyParser.raw({limit: '1mb'}));
  express.use(bodyParser.text({limit: '1mb'}));
  express.use(cors({origin: '*'}));
  express.use((req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
  });
  /*
   * load API routes
   */
  require('../../api_http')(express, app);
  return express;
};
