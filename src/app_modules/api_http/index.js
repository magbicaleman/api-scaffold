'use strict';
const path = require('path');
const fs = require('fs');

module.exports = async function(express) {
  /*
   * Go through all http directories and attach the router to the resource
   */
  const resourcePath = path.resolve(path.join(__dirname), './');
  const resources = fs.readdirSync(resourcePath);
  resources.forEach(function(resource) {
    if (resource !== 'index.js') {
      express.use('/' + resource, require('./' + resource + '/http.routes'));
    }
  });
};

