'use strict';

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

module.exports = new Promise(function(resolve, reject) {
  //mongoose.set('debug', true);
  mongoose.connect(appModules.config.mongo.uri, appModules.config.mongo.options);
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
