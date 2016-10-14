'use strict';

module.exports = async function() {
  return {
    mongo: await require('./mongo'),
    http: require('./http'),
    responseHandler: require('./response_handler')
  };
};
