'use strict';
const Promise = require('bluebird');
const cluster = require('cluster');
const routes = require('./app_modules/api_http');

routes();
