'use strict';

/**
 * Socket.io Configuration
 *  - the API will serve up the socket.io client library /socket-io
 *  - the websocket transport will be used
 *  - using red
 *
 *
 * @name socket.io
 * @param api
 * @param app
 * @memberOf app.services
 */
module.exports = function(api, app) {
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
  return socketio;
};
