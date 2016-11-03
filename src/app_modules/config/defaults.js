'use strict';
/**
 * Default configuration values that apply regardless of environment
 * @memberOf app.config
 * @inner
 * @name defaults
 * @property {string} environment - Current environment the application is running in (ex. dev, staging, production). Defaults to **local**
 * @property {string} app_name - Name of the application
 * @property {string} seed_data - Seed data on startup. Defaults to **true**
 * @property {string} log_level - The log level for the application (ex. info, warn, debug, silly). Defaults to **debug**
 * @property {object} jwt - JWT configuration
 * @property {string} jwt.secret - Secret for JWT encryption
 * @property {string} jwt.content_secret - Secret for content inside JWT
 * @property {object} services - Configurations for all services
 * @property {object} services.http - HTTP configuration
 * @property {number} services.http.port - Port for http service to listen on. Defaults to **9000**
 * @property {object} services.mongo - Mongo configuration
 * @property {string} services.mongo.uri - Connection URI
 * @property {boolean} services.mongo.debug - Enable Mongo debugging. Defaults to **false**
 * @property {boolean} services.mongo.enable_db_encryption - Enable db level encryption. Defaults to **false**
 * @property {string} services.mongo.encryption_key - Encryption key for db level encryption
 * @property {string} services.mongo.signing_key - Signing key for db level encryption
 * @property {object} services.mongo.options - Mongo connection options
 * @property {object} services.mongo.options.replset - Mongo replica set configuration
 * @property {boolean} services.mongo.options.replset.ssl - Use SSL when connecting to replica set. Defaults to **true**
 * @property {boolean} services.mongo.options.replset.ha - Enable **High Availability** mode. Defaults to **true**
 * @property {object} services.redis - Redis configuration
 * @property {string} services.redis.password - Redis password (if applicable)
 * @property {object} services.redis.clients - Client configurations for redis
 * @property {string} services.redis.clients.host - URI for redis connection
 * @property {number} services.redis.clients.port - Port for redis connection
 * @property {object} services.redis.clients.settings - Connection settings for redis client
 * @property {object} notifications - Notification configuration (if applicable)
 * @property {string} notifications.slack - Slack URI for incoming weebhook to use for notifications
 */
module.exports = {
  environment: process.env.NODE_ENV || 'local',
  app_name: process.env.APP_NAME || 'api',
  seed_data: process.env.SEED_DATA === 'true',
  log_level: process.env.LOG_LEVEL || 'debug',
  jwt: {
    secret: process.env.JWT_SECRET || 'fAmAT93K584WY1w4dGYg3kL387nMGRgf',
    content_secret: process.env.JWT_CONTENT_SECRET || 'd6F3Efeq',
  },
  services: {
    http: {
      port: process.env.PORT || 9000
    },
    mongo: {
      uri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/api',
      debug: false, // set to true to enable mongo debugging
      enable_db_encryption: process.env.MONGO_ENCRYPTED ? process.env.MONGO_ENCRYPTED : false,
      encryption_key: process.env.MONGO_ENCRYPTION_KEY ? process.env.MONGO_ENCRYPTION_KEY : '',
      signing_key: process.env.MONGO_SIGNING_KEY ? process.env.MONGO_SIGNING_KEY : '',
      options: {
        replset: {
          ssl: true,
          ha: true
        }
      }
    },
    redis: {
      password: process.env.REDIS_PASSWORD || false,
      clients: {
        socketio: {
          host: process.env.REDIS_SOCKETIO_HOST || '127.0.0.1' ,
          port: process.env.REDIS_SOCKETIO_PORT || 6379,
          settings: {
            detect_buffers: true
          }
        }
      }
    }
  },
  notifications: {
    slack: {
      url: process.env.SLACK_URL
    }
  }
};
