'use strict';

/**
 * TODO: Describe the http module
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
