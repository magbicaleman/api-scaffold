'use strict';

const Promise = require('bluebird');
const mongoose = require('mongoose');
mongoose.Promise = Promise;

/**
 * TODO: Description of models
 * @memberOf app.models
 * @namespace app.models.mongo
 * @param app
 */
module.exports = function(app) {
  return new Promise(function(resolve, reject) {
    mongoose.set('debug', app.config.services.mongo.debug);
    mongoose.connect(app.config.services.mongo.uri, app.config.services.mongo.options);
    mongoose.connection.on('error', function(err) {
      logger.error(err);
    });
    mongoose.connection.on('connected', function(err) {
      if (err) {
        reject(err);
      } else {
        logger.info('CONNECTION TO MONGODB ESTABLISHED');
        resolve(mongoose);
      }
    });
  });
};
