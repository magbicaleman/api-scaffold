'use strict';
/**
 * Services
 * ========
 * All services are meant to encapsulate external connections and other systems.
 *  For anything related to internal functions see {@link app.shared}
 *  For anything related to clients see {@link app.clients}
 *
 * ### Available Services ###
 * * {@link http} - node http services
 *
 * @memberOf app
 * @namespace app.services
 * @param app
 * @returns {{http: {express, server, socketio}}}
 */
module.exports = async function(app) {
  return {
    http: require('./http')(app)
  };
};
