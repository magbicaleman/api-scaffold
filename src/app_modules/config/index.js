'use strict';
const _ = require('lodash');
/**
 * TODO: Description of config
 * @memberOf app
 * @namespace app.config
 */
module.exports = _.merge(require('./defaults.js') || {}, require('./env/' + process.env.NODE_ENV + '.js') || {});