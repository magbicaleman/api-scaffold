'use strict';
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const algorithm = 'aes-256-ctr';

module.exports = {
  verify: verify,
  decryptToken: decryptToken,
  signToken: signToken,
  getUserToken: getUserToken,
  encryptContents: encryptContents,
  decryptContents: decryptContents
};

function decryptToken(token) {
  return new Promise(function(resolve, reject) {
    jwt.verify(token, app.config.jwt.secret, function(err, decodedToken) {
      if (err || !decodedToken) {
        reject({error: 'invalid-token'});
      } else {
        resolve({decodedToken: decryptContents(decodedToken), token: token});
      }
    });
  });
}

function verify(req, res, next) {
  var authorization = req.headers['authorization'] || '';
  var token = authorization.replace('Bearer ', '').replace('bearer ', '');
  // Add all endpoints that are publicly available here:
  if (!token) {
    next();
  } else {
    req.token = token;
    try {
      jwt.verify(token, app.config.jwt.secret, function(err, decodedToken) {
        if (err || !decodedToken) {
          return res.status(401).json({
            error: 'invalid-token'
          });
        }
        req.user_session = decryptContents(decodedToken);
        //TODO: Check redis instead of querying db each time.
        appModules.models.User.findOne({_id: req.user_session.user_id}, {'status': 0})
          .then(function(user) {
            if (!user) {
              return res.status(401).json({
                error: 'invalid-user'
              });
            }
            req.user = user;
            next();
          })
          .catch(function(err) {
            return res.status(401).json({
              error: 'invalid-user'
            });
          });
      });
    } catch (error) {
      logger.error('token error: ' + error);
    }
  }
}

function signToken(tokenObj, tokenOptions) {
  return jwt.sign({contents: encryptContents(tokenObj)}, app.config.jwt.secret, tokenOptions);
}

function getUserToken(user) {
  return signToken({
    email: user.local.email,
    user_id: user._id,
    first_name: user.local.firstname,
    last_name: user.local.lastname
  }, {
    algorithm: 'RS256',
    header: {
      'alg': 'HS256',
      'typ': 'JWT'
    }
  });
}

function encryptContents(contents) {
  const text = JSON.stringify(contents);
  const cipher = crypto.createCipher(algorithm, app.config.jwt.content_secret);
  let crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

function decryptContents(text) {
  const decipher = crypto.createDecipher(algorithm, app.config.jwt.content_secret);
  let dec = decipher.update(text.contents, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return JSON.parse(dec);
}