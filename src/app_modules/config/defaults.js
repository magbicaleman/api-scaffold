'use strict';

module.exports = {
  environment: process.env.NODE_ENV,
  app_name: process.env.APP_NAME || '352_scaffold',
  seed_data: process.env.SEED_DATA === 'true',
  log_level: process.env.LOG_LEVEL || 'debug',
  services: {
    express: {
      port: process.env.PORT || 9000
    },
    mongo: {
      uri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/352_scaffold',
      debug: false, // set to true to enable mongo debugging
      options: {
        replset: {
          ssl: true,
          ha: true
        }
      },
      enable_db_encryption: process.env.MONGO_ENCRYPTED ? process.env.MONGO_ENCRYPTED : false,
      encryption_key: process.env.MONGO_ENCRYPTION_KEY ? process.env.MONGO_ENCRYPTION_KEY : '',
      signing_key: process.env.MONGO_SIGNING_KEY ? process.env.MONGO_SIGNING_KEY : ''
    },
    redis: {
      clients: {
        socketio: {
          host: process.env.REDIS_SOCKETIO_HOST || '127.0.0.1' ,
          port: process.env.REDIS_SOCKETIO_PORT || 6379,
          settings: {
            detect_buffers: true
          }
        },
        user_sessions: {
          host: process.env.REDIS_USER_SESSIONS_HOST || '127.0.0.1',
          port: process.env.REDIS_USER_SESSIONS_PORT || 6379,
          settings: {}
        }
      },
      password: process.env.REDIS_PASSWORD || false
    }
  },
  notifications: {
    slack: {
      url: process.env.SLACK_URL
    }
  }
};
