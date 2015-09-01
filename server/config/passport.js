/* 
* @Author: Katrina Uychaco
* @Date:   2015-08-05 17:46:59
* @Last Modified by:   kuychaco
* @Last Modified time: 2015-08-07 19:07:41
*/

'use strict';

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// Load the User model
var User = require('./db_models.js').User;
var userController = require('../User/userController.js');

var googleOptions = process.env.PORT ? 
  {
    'clientID': '195378471050-agauijdj217rti1dq594it21j30u4vrm.apps.googleusercontent.com',
    'clientSecret': 'kGR7BKpjhrHYba4hiZsGjZ-I',
    'callbackURL': 'http://linkd.herokuapp.com/api/user/auth/google/callback'
  } :
  {
    'clientID': '195378471050-o9i2qjic5sq2395plkfclse8fdl2quse.apps.googleusercontent.com',
    'clientSecret': 'kdaGt5vgxToQAKIlrCAH4tJK',
    'callbackURL': 'http://127.0.0.1:8000/api/user/auth/google/callback'
  };


module.exports = function(passport) {

  // Set up Passport Session
  // For persistent login sessions, passport needs to serialize and unserialize users out of session
  passport.serializeUser(function(user, done) {
    console.log('Serialize User');
    done(null, user.dataValues.user_id_google);
  });
  passport.deserializeUser(function(id, done) {
    console.log('Deserialize User');
    User.findById(id).then(function(user) {
      console.log('Passport deserializeUser');
      done(null, user);
    });
  });

  // Google Strategy
  passport.use(new GoogleStrategy(googleOptions,
  function(token, refreshToken, profile, done) {
    console.log('Google Strategy Callback');
    // Check database only once we have all our data back
    process.nextTick(function() {
      console.log('Check Database for User');

      userController.checkUserAuth(profile, function(err, user) {
        if (err) return done(err);
        return done(null, user);
      });

    });
  }
  ));

}