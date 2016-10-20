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
 * @namespace global
 * @name init
 */
async function init() {
  /**
   * app namespace
   * @namespace app
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
  // add models to app
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
            resolve(app);
          }
        }
      );
    } else {
      resolve(app);
    }
  });
}

// Initialize the server
init()
  .then(notifyOnStart)
  .then(app => {
    app.services.http.server.listen(app.config.services.http.port);
    global.logger.info('HTTP server listening on port ', app.config.services.http.port);
    global.logger.info('Server initialization complete!');
  })
  .catch(global.logger.error);
