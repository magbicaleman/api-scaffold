'use strict';

module.exports = {
  app_name: process.env.APP_NAME || '352_scaffold',
  services: {
    express: {
      port: process.env.PORT || 9000
    },
    mongo: {
      uri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/352_scaffold'
    }
  }
};
