// User Controller
// ---------------
//
// Handle interacting with the User data in the database.

'use strict';

var User = require('../config/db_models.js').User;

// Check if user is in database
module.exports.checkUserAuth = function(profile, token, callback) {

  User.findOrCreate({ where: {
    user_id_google: profile.id,
    token_google: token,
    name_google: profile.displayName,
    email_google: profile.emails[0].value
  } })
  .spread(function(user, created) {
    // console.log('New user:', user.get({
    //   plain: true
    // }));
    console.log('New user created:', created);
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
    .then(function(users) {
      console.log('Retrieved list of all users from database');
      res.json(users);
    })
    .error(function(err) {
      console.error('Error retrieving list of all users:', err);
      res.status(500).send(err);
    });
};
