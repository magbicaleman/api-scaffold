'use strict';
const _ = require('lodash');
/**
 * The config folder will merge in the defaults with the different environment
 *  specific settings. Most will look at environment variables so they are
 *  configured outside of the code.
 *
 * @memberOf app
 * @namespace app.config
 */
module.exports = _.merge(require('./defaults.js') || {}, require('./env/' + process.env.NODE_ENV + '.js') || {});