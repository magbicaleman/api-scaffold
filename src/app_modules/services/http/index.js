'use strict';

const express = require('express')();
const api = require('http').createServer(express);
const compress = require('compression');
const bodyParser = require('body-parser');
const cors = require('cors');

module.exports = function() {

  /*
   * Configure all express middleware
   */

  express.use(compress({threshold: 1024}));
  express.use(bodyParser.urlencoded({extended: true}));
  express.use(bodyParser.json({limit: '1mb'}));
  express.use(bodyParser.raw({limit: '1mb'}));
  express.use(bodyParser.text({limit: '1mb'}));
  express.use(cors({origin: '*'}));
  express.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
  });

  /*
   * load API routes
   */
  require('../../api_http')(express);

  /*
   * Configure socket.io.
   */
  const socketio = require('socket.io')(api, {
    serveClient: true,
    transports: ['websocket']
  });
  const redis = require('redis').createClient;
  const adapter = require('socket.io-redis');
  const pub = redis(app.config.services.redis.clients.socketio.port, app.config.services.redis.clients.socketio.host, {
    return_buffers: true,
    auth_pass: app.config.services.redis.password
  });
  const sub = redis(app.config.services.redis.clients.socketio.port, app.config.services.redis.clients.socketio.host, {
    return_buffers: true,
    auth_pass: app.config.services.redis.password
  });
  socketio.adapter(adapter({
    host: app.config.services.redis.clients.socketio.host,
    port: app.config.services.redis.clients.socketio.port,
    pubClient: pub,
    subClient: sub
  }));

  /*
   * Load socket routes
   */
  require('../../api_socket')(socketio);

  return {express: express, server: api, socketio: socketio};
};
