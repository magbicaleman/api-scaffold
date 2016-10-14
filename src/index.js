'use strict';

const config = require('./app_modules/config');

config.init()
  .then(() => {
    console.log('Server Started...');
  })
  .catch(console.error);
