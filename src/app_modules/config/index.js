'use strict';

var _ = require('lodash');
var winston = require('winston');

module.exports = {
  init: init
};

global.app = {};
app.config = _.merge(require('./defaults.js') || {}, require('./env/' + process.env.NODE_ENV + '.js') || {});

/**
 * This function initializes the application by calling initLogging, initAppModules and notifyOnStart

 * @namespace config
 * @name init
 */
async function init() {
  initLogging();
  return initAppModules()
    .then(notifyOnStart);
}

/**
 * This function sets up the global modules for the application. These are accessible as
 * global.services (services such as redis, mongo, etc ../services)
 * global.shared (shared functions ../shared)
 * global.models (mongo models ../services/mongo/models)

 */
async function initAppModules() {
  app.shared = require('../shared');
  app.services = await require('../services')();

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
      new (winston.transports.Console)({level: app.config.log_Level})
    ]
  });
}

/**
 * This function is used to send a notification to a slack channel once the application has started

 * @method notifyOnStart
 */
function notifyOnStart(environment) {
  if (app.config.environment !== 'local') {
    const request = require('request');
    request.post(app.config.notifications.slack.url,
      {
        form: {
          payload: '{"text": "' + app.config.app_name + ' started in ' + app.config.environment + '"}'
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
