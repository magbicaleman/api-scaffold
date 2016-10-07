'use strict';

/*
 * Load Controllers
 */
const user = require('./user');

module.exports = function(express) {

  /*
   * Add Routes
   */
  express.route('/user')
    .post(user.create)
    .put(user.update)
    .delete(user.remove);

  express.route('/user/login')
    .post(user.login)
    .delete(user.logout);

};
