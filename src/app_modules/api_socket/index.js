'use strict';

/**
 * TODO: Describe socket.io routing
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
