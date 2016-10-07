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
  require('../../api_http/routes')(express);

  /*
   * Configure socket.io.
   */
  const socketio = require('socket.io')(api, {
    serveClient: true,
    transports: ['websocket']
  });
  const redis = require('redis').createClient;
  const adapter = require('socket.io-redis');
  const pub = redis(app.config.redis.clients.socketio.port, app.config.redis.clients.socketio.host, {
    return_buffers: true,
    auth_pass: app.config.redis.password
  });
  const sub = redis(app.config.redis.clients.socketio.port, app.config.redis.clients.socketio.host, {
    return_buffers: true,
    auth_pass: app.config.redis.password
  });
  socketio.adapter(adapter({
    host: app.config.redis.clients.socketio.host,
    port: app.config.redis.clients.socketio.port,
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
    socket.on('client-event', async function(data) {
      data = JSON.parse(data);
      const jwt = await app.shared.session.decryptToken(data.token);
      data.session = await app.services.redis.clients.user_sessions.hgetallAsync(jwt.decodedToken.email);
      require('../../api_socket/' + data.context + '/' + data.action)(data, socket);
    });
  });
  return {express: express, server: api, socketio: socketio};
};
