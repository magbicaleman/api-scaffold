'use strict';

/**
 * {@link app.shared| Shared Services}
 *
 * ResponseHandler is a centralized way of responding to all http requests.
 * This will help centralize what error codes are used by default and also
 * handle anything we need to inject when responding
 *
 * The functions all take 2 parameters:
 * * res - the express response object
 * * payload - what to send back
 *
 * @module responseHandler
 * @memberOf app.shared
 * @see app.shared
 *
 * @param app
 * @returns {{success: success, error: error}}
 */
module.exports = function(app) {
  /**
   * Responds with a 200 unless you pass in a
   * payload.responseCode and the body comes from payload.data.
   *
   * @param res - express response object
   * @param payload - object
   *  * responseCode - what HTTP response code you want to return (200 default)
   *  * data - what will be sent in body
   */
  function success(res, payload) {
    if (!payload) {
      payload = {};
    }
    const responseData = payload.data || {success: true};
    const responseCode = payload.responseCode || 200;
    res.status(responseCode).json(responseData);
    logger.silly(JSON.stringify(responseData));
  }

  /**
   * Responds with a 500 unless you pass in a
   * payload.error.responseCode or payload.responseCode.
   *
   * @param res - express response object
   * @param payload - object
   *  * responseCode - what HTTP response code you want to return (500 default)
   *  * error - what will be sent in body
   *    * responseCode - if the error dictates the resp code.
   *    * message - error message
   */
  function error(res, payload) {
    if (!payload) {
      payload = {};
    }
    var responseCode;
    if (payload.error && payload.error.responseCode) {
      responseCode = payload.error.responseCode;
    } else {
      responseCode = payload.responseCode || 500;
    }
    const response = {error: payload.error.message || payload.error};
    if (process.env.NODE_ENV === 'local') {
      logger.error(payload.error.stack || payload.error);
    } else if (responseCode === 500) {
      logger.error(payload.error.stack || payload.error);
    }
    res.status(responseCode).send(response);
  }

  return {
    success: success,
    error: error
  };
};
