'use strict';

/**
 * Create a user
 * @memberOf HTTP.routes.user
 * @instance
 * @name create
 * @param req
 * @param res
 */
module.exports = function(app) {
  return function(req, res) {
    app.shared.responseHandler.success(res);
  };
};
