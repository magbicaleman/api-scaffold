var mongoose = require('mongoose');
var  moment = require('moment');
var  bcrypt = require('bcrypt-nodejs');
var  uuid = require('node-uuid');

var userSchema = new mongoose.Schema({
  firstname: {type: String},
  lastname: {type: String},
  email: {type: String, unique: true, required: true},
  password: {type: String},
  username: {type: String},
  created: {type: Date, default: moment.utc}
});
module.exports = mongoose.model('User', userSchema);