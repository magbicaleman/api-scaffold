'use strict';
const Promise = require('bluebird');

module.exports = async function() {
  let [mongo, http, responseHandler] = await Promise.all([
    require('./mongo'),
    require('./http'),
    require('./response_handler')
  ]);
  return {
    http,
    mongo,
    responseHandler
  };
};
