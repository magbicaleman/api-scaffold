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
  const pub = redis(appModules.config.redis.clients.socketio.port, appModules.config.redis.clients.socketio.host, {
    return_buffers: true,
    auth_pass: appModules.config.redis.password
  });
  const sub = redis(appModules.config.redis.clients.socketio.port, appModules.config.redis.clients.socketio.host, {
    return_buffers: true,
    auth_pass: appModules.config.redis.password
  });
  socketio.adapter(adapter({
    host: appModules.config.redis.clients.socketio.host,
    port: appModules.config.redis.clients.socketio.port,
    pubClient: pub,
    subClient: sub
  }));
  socketio.on('connection', function(socket) {
    socket.emit('connection-event', 'socket connection successful for socket: ' + socket.id);
    socket.on('disconnect', function() {
      require('../../api_socket/disconnect')(this);
    });
    socket.on('reconnect', function() {
      require('../../api_socket/reconnect')(this);
    });
    socket.on('client-event', function(data) {
      data = JSON.parse(data);
      const jwt = await appModules.shared.session.decryptToken(data.token);
      const session = await appModules.services.redis.clients.user_sessions.hgetallAsync(jwt.decodedToken.email);
      data.session = session;
      require('../../api_socket/' + data.context + '/' + data.action)(data, socket);
    });
  });
  return {express: express, server: api, socketio: socketio};
};
