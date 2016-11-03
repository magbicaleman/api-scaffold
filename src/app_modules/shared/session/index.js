'use strict';
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const algorithm = 'aes-256-ctr';

/**
 * session
 * =========
 * All the services associated with maintaining a session.
 *
 * session Functions
 * ---------
 *
 * ### session.getUserSession ###
 * getUserSession()
 * * parameters:
 *  * token - token to decrypt
 * * response:
 *  * object
 *   * error - any error that occurred
 *   * decodedToken - contents
 *   * token - token for matching
 *
 * @name session
 * @memberOf app.shared
 *
 * @param app
 * @returns {{getUserSession: getUserSession, generateUserToken: generateUserToken}}
 */
module.exports = function(app) {
  async function getUserSession(token) {
    const tokenContents = await decryptToken(app, token);
    const userRecord = await app.models.User.findOne({_id: tokenContents.user_id}, {'status': 0}).lean();
    if (!userRecord) {
      return {error: 'invalid-user'};
    } else {
      return userRecord;
    }
  }

  function generateUserToken(user) {
    const contents = {
      email: user.email,
      user_id: user._id
    };
    const options = {
      algorithm: 'RS256',
      header: {
        'alg': 'HS256',
        'typ': 'JWT'
      }
    };
    jwt.sign({contents: encryptTokenContents(contents)}, app.config.jwt.secret, options);
  }

  function decryptToken(token) {
    jwt.verify(token, app.config.jwt.secret, function(err, verifiedToken) {
      if (err || !verifiedToken) {
        return {error: 'invalid-token'};
      } else {
        decryptTokenContents(app, verifiedToken);
      }
    });
  }

  function decryptTokenContents(verifiedToken) {
    const decipher = crypto.createDecipher(algorithm, app.config.jwt.content_secret);
    let dec = decipher.update(verifiedToken.contents, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return JSON.parse(dec);
  }

  function encryptTokenContents(contents) {
    const text = JSON.stringify(contents);
    const cipher = crypto.createCipher(algorithm, app.config.jwt.content_secret);
    let encryptedContents = cipher.update(text, 'utf8', 'hex');
    encryptedContents += cipher.final('hex');
    return encryptedContents;
  }

  return {
    getUserSession: getUserSession,
    generateUserToken: generateUserToken
  };
};
