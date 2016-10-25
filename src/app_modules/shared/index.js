'use strict';
/**
 * TODO: Description of shared functions
 * @memberOf app
 * @namespace app.shared
 * @param app
 * @returns {{session: {verify, decryptToken, signToken, getUserToken, encryptContents, decryptContents}}}
 */
module.exports = function(app) {
  return {
    session: require('./session')(app)
  };
};
