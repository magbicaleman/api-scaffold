'use strict';
const winston = require('winston');

/**
 * The init function creates the app namespace. It will initialize all:
 *
 * **global.logger** (replacement for console.log)
 *
 * **app.services** (./app_modules/services)
 *
 * **app.shared functions** (./app_modules/shared)
 *
 * **app.models.mongo** (currently only mongoose models)
 * @method
 * @name init
 */
async function init() {
  /**
   * app namespace
   * @namespace
   */
  let app = {};
  // add config to app
  app.config = require('./app_modules/config');
  /**
   * replaces console.log
   * @namespace logger
   * @type {winston.Logger}
   */
  global.logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({level: app.config.log_Level})
    ]
  });
  // add shared functions to app
  app.shared = require('./app_modules/shared')(app);
  // add services to app
  app.services = await require('./app_modules/services')(app);
  /**
   *
   * @type {{mongo: {User: *}}}
   */
  app.models = {
    mongo: require('./app_modules/services/mongo/models')
  };
  return app;
}

/**
 * Send notification to slack that the server has started
 * @param app
 * @returns {Promise}
 */
function notifyOnStart(app) {
  return new Promise(function(resolve, reject) {
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
            reject(error);
          } else {
            resolve();
          }
        }
      );
    } else {
      resolve();
    }
  });
}

init()
  .then(notifyOnStart)
  .then(() => {
    global.logger.info('Server Started');
  })
  .catch(global.logger.error);
