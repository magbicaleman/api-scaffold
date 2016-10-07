'use strict';

var _ = require('lodash');
var path = require('path');
var winston = require('winston');

module.exports = {
  init: init
};

/**
 * This function initializes the application by calling initLogging, initAppModules and notifyOnStart

 * @namespace config
 * @name init
 */
function init() {
  initLogging();
  initAppModules();
  notifyOnStart();
}

/**
 * This function sets up the global modules for the application. These are accessible as
 * global.services (services such as redis, mongo, etc ../services)
 * global.shared (shared functions ../shared)
 * global.models (mongo models ../services/mongo/models)

 */
function initAppModules() {
  initLogging();
  global.app = {};
  app.config = _.merge(require('./defaults.js') || {}, require('./' + process.env.NODE_ENV + '.js') || {});
  app.shared = require('../shared');

  /*
   * Add models for all DBs - currently only Mongo is configured
   */
  app.models = {
    mongo: require('../services/mongo/models')
  };
}

/**
 * This function creates an instance of global.logger. It is used as an alternative to console.log.
 * It has multiple log levels such as info, error, warn, debug and silly.
 * To use it simply call logger.[LOG_LEVEL]('some message');

 * @method initLogging
 */
function initLogging() {
  global.logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({level: process.env.LOG_LEVEL || 'debug'})
    ]
  });
  logger.filters.push(function(level, msg, meta) {
    if (app.config.workerId) {
      return 'Worker ' + app.config.workerId + ' ' + msg;
    } else {
      return msg;
    }
  });
}

/**
 * This function is used to send a notification to a slack channel once the application has started

 * @method notifyOnStart
 */
function notifyOnStart(environment) {
  if (environment !== 'local') {
    var request = require('request');
    request.post(process.env.SLACK_URL,
      {
        form: {
          payload: '{"text": "' + process.env.APP_NAME + ' started in ' + environment + '"}'
        }
      },
      function(error, response, body) {
        if (error) {
          logger.error(error);
        }
      }
    );
  }
}
