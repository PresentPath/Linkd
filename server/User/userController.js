// User Controller
// ---------------
//
// Handle interacting with the User data in the database.

'use strict';

var User = require('../config/db_models.js').User;
var helpers = require('../config/helpers.js');


// Check if user is in database
module.exports.checkUserAuth = function(profile, callback) {

  User.find({ where: {user_id_google: profile.id} })
    .then(function(user) {
      if (user) {
        console.log('User', user.get({plain:true}).name_google, 'already exists');
        callback(null, user);
      }

      // If user not found, create user
      if (user === null) {
        module.exports.createUserAuth(profile, callback);
      }
    })
    .error(function(err) {
      console.error('Error finding user:', err);
      callback(err);
    });
};

// Create new user in database
module.exports.createUserAuth = function(profile, callback) {

  User.create({
    user_id_google: profile.id,
    // token_google: token,  // not using api token for anything at this point
    name_google: profile.displayName,
    email_google: profile.emails[0].value
  })
  .then(function(user) {
    console.log('User', user.get({plain:true}).name_google, 'created');
    callback(null, user);
  })
  .error(function(err) {
    console.error('Error creating user:', err);
    callback(err);
  });
};

// Retrieve list of all users
module.exports.getUsersList = function(req, res, next) {

  User.findAll()
    .then(helpers.handleSuccess(res, 'Retrieved list of all users from database'))
    .error(helpers.handleError(res, 'Error retrieving list of all users:'));

};

// Retrieve info for logged in user
module.exports.getUserInfo = function(req, res, next) {

  var userId = req.session.passport.user || '1';

  User.find({ where: { user_id_google: userId } })
    .then(function(user) {
      user.dataValues.productionEnvironment = process.env.NODE_ENV === 'production';
      helpers.handleSuccess(res, 'Retrieved user info from database', user);
    })
    .error(helpers.handleError(res, 'Error retrieving user info:'));

};
