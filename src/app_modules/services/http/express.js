'use strict';

const express = require('express')();
const compress = require('compression');
const bodyParser = require('body-parser');
const cors = require('cors');

/**
 * Express configuration for serving up the API
 * ### Settings ###
 * * compress
 * * bodyParser
 *  * urlencoded - handle encoding with the qs parser
 *  * json - 1mb limit on JSON body
 *  * raw - 1mb limit on raw body
 *  * raw - 1mb limit on text body
 * * cors - support for all cors request since this API may be used by outside
 * * Headers: see code.
 *
 * @name express
 * @memberOf app.services
 */
module.exports = function(app) {
  express.use(compress({threshold: 1024}));
  express.use(bodyParser.urlencoded({extended: true}));
  express.use(bodyParser.json({limit: '1mb'}));
  express.use(bodyParser.raw({limit: '1mb'}));
  express.use(bodyParser.text({limit: '1mb'}));
  express.use(cors({origin: '*'}));
  express.use((req, res, next) => {
    //Get user session for each request
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
  });
  express.use((req, res, next) => {
    if (req.headers.authorization) {
      const token = req.headers.authorization.replace('Bearer ', '').replace('bearer ', '');
      const session = app.shared.session.getUserSession(token);
      if (session.error) {
        res.status(401).json(session.error);
      } else {
        req.user = session;
        next();
      }
    } else {
      next();
    }
  });
  /*
   * load API routes
   */
  require('../../api_http')(express, app);
  return express;
};
