'use strict';

/**
 * The server side events will be processed from here.
 * 'connection' - Occurs when a user connects and also when they refresh the page
 * 'disconnect' - user disconnect or refresh
 * 'reconnect' - when user's internet is disrupted and they are reconnected via
 * retry mechanism and not a refresh
 * 'ping' handled by socket.io and will respond with 'pong'
 * 'client-event' - Any event that we want the client to notify the server of.
 *    The contents dictate what actually happened. This helps with triaging
 *    several message types without new plumbing. This is a convention based
 *    process.
 *
 * @param socketio
 */
module.exports = function(socketio) {
  socketio.on('connection', function(socket) {
    socket.emit('connection-event', 'socket connection successful for socket: ' + socket.id);
    socket.on('disconnect', function() {
      require('./disconnect')(this);
    });
    socket.on('reconnect', function() {
      require('./reconnect')(this);
    });
    socket.on('client-event', async function(data) {
      data = JSON.parse(data);
      data.session = await app.shared.session.getSessionFromToken(data.token);
      require('./' + data.resource + '/' + data.action)(data, socket);
    });
  });
};
