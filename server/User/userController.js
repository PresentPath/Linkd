// User Controller
// ---------------
//
// Handle interacting with the User data in the database.

'use strict';

var User = require('../config/db_models.js').User;


module.exports.checkUserAuth = function(profile, token, callback) {
  User.find({ where: {user_id_google: profile.id} })
  .then(function(user) {
    if (user) {
      console.log('User', user.get({plain:true}).name_google, 'already exists');
      callback(null, user);
    }
    if (user === null) {
      module.exports.createUserAuth(profile, token, callback);
    }
  })
  .error(function(err) {
    console.error('Error finding user:', err);
    callback(err);
  });
};

module.exports.createUserAuth = function(profile, token, callback) {
  User.create({
    user_id_google: profile.id,
    token_google: token,
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
