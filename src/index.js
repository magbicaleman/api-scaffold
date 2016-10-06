'use strict';
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
const cluster = require('cluster');

async function main() {
  var response = await request('https://google.com');
  console.log(cluster);
}

main();
