'use strict';

module.exports = {
  app_name: process.env.APP_NAME || '352_scaffold',
  seedData: process.env.SEED_DATA === 'true',
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
      enableDbEncryption: process.env.MONGO_ENCRYPTED ? process.env.MONGO_ENCRYPTED : false,
      encryptionKey: process.env.MONGO_ENCRYPTION_KEY ? process.env.MONGO_ENCRYPTION_KEY : '',
      signingKey: process.env.MONGO_SIGNING_KEY ? process.env.MONGO_SIGNING_KEY : ''
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
  }
};
