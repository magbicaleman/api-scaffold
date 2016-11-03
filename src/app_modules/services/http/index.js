'use strict';

/**
 * Configures the HTTP handler to include Express and Socket.IO
 * and links in the API routes.
 * @memberOf app.services
 *
 * @name http
 * @param app
 * @returns {{express, server, socketio}}
 */
module.exports = function(app) {
  const express = require('./express')(app);
  const api = require('http').createServer(express);
  const socketio = require('./socket.io')(api, app);
  return {express: express, server: api, socketio: socketio};
};
