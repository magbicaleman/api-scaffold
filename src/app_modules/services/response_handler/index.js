'use strict';

/**
 * TODO: Describe Response Handler service
 * @param app
 * @returns {{success: success, error: error}}
 */
module.exports = function(app) {
  function success(res, payload) {
    if(!payload) {
      payload = {};
    }
    const responseData = payload.data || {success: true};
    const responseCode = payload.responseCode || 200;
    res.status(responseCode).json(responseData);
    logger.silly(JSON.stringify(responseData));
  }

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
