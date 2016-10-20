'use strict';

/**
 * Create a user
 * @memberOf HTTP.routes.user
 * @instance
 * @name create
 * @param req
 * @param res
 */
module.exports = function(req, res, app) {
  console.log(app);
  app.services.responseHandler.success(res);
};
