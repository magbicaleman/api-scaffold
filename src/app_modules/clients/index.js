'use strict';
/**
 * Clients
 * ========
 * All clients are meant to encapsulate external connections to other systems.
 *  For anything related to internal functions see {@link app.shared}
 *  For anything related to services see {@link app.services}
 *
 * ### Available Clients ###
 * * mongo - mongoDB client (using mongoose)
 * * redis - redis client (using node-redis)
 *
 * @memberOf app
 * @namespace app.clients
 * @param app
 * @returns {{mongo: *, redis: *}}
 */
module.exports = async function(app) {
  return {
    mongo: await require('./mongo')(app),
    redis: await require('./redis')(app)
  };
};
