'use strict';

const redis = require('redis');
const Promise = require('bluebird');
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

module.exports = new Promise(function(resolve, reject) {
  var promiseArray = [];
  var clients = {};
  Object.keys(app.config.services.redis.clients).forEach(function(client) {
    clients[client] = redis.createClient(app.config.services.redis.clients[client].port, app.config.services.redis.clients[client].host || '127.0.0.1', app.config.services.redis.clients[client].settings);
  });
  if (!app.config.services.redis.password) {
    Object.keys(clients).forEach(function(client, i) {
      promiseArray.push(clients[client].selectAsync(i));
    });
  } else {
    Object.keys(clients).forEach(function(client) {
      promiseArray.push(clients[client].authAsync(app.config.services.redis.password));
    });
  }
  Promise.all(promiseArray)
    .then(function() {
      logger.info('CONNECTION TO REDIS ESTABLISHED');
      if (app.config.seedData) {
        Object.keys(clients).forEach(function(client) {
          clients[client].flushall();
        });
      }
      resolve({clients: clients});
    })
    .catch(function(err) {
      reject(err);
    });
});
