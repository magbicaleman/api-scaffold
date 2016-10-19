'use strict';
/**
 * TODO: Description of services
 * @memberOf app
 * @namespace app.services
 * @param app
 * @returns {{mongo: *, http: {express, server, socketio}, redis: *, responseHandler: {success, error}}}
 */
module.exports = async function(app) {
  return {
    mongo: await require('./mongo')(app),
    http: require('./http')(app),
    redis: await require('./redis')(app),
    responseHandler: require('./response_handler')(app)
  };
};
