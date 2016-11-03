'use strict';
/**
 * Shared Functions
 * ========
 * The items in the /shared folder are to represent reusuable pieces of code
 * that we didn't want duplicated in multiple places. This could include something
 * as simple as a formatting function to as complex as the proper way to get
 * a record from a data store.
 *
 *  For anything related to service related functions see {@link app.services}
 *
 * ### Shared Services ###
 * * {@link app.shared.module:session|session}
 * * {@link app.shared.module:responseHandler|responseHandler}
 *
 * @memberOf app
 * @namespace app.shared
 * @param app
 * @returns {{session: *, responseHandler: *}}
 */

module.exports = function(app) {
  return {
    session: require('./session')(app),
    responseHandler: require('./response_handler')(app)
  };
};
