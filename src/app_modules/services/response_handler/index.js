'use strict';

module.exports = function(app) {
  function success(responseData, payload) {
    responseData = responseData || {success: true};
    var responseCode = payload.responseCode || 200;
    payload.webResponse.status(responseCode).json(responseData);
    logger.silly(JSON.stringify(responseData));
  }

  function error(error, payload) {
    var responseCode;
    if (error && error.responseCode) {
      responseCode = error.responseCode;
    } else {
      responseCode = payload.responseCode || 500;
    }
    var response = {error: error.message || error.error};
    if (process.env.NODE_ENV === 'local') {
      console.error(error.stack || error);
    } else if (responseCode === 500) {
      console.error(error.stack || error);
    }
    payload.webResponse.status(responseCode).send(response);
  }

  return {
    success: success,
    error: error
  };
};
