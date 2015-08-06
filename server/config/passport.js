/* 
* @Author: Katrina Uychaco
* @Date:   2015-08-05 17:46:59
* @Last Modified by:   Katrina Uychaco
* @Last Modified time: 2015-08-05 22:43:37
*/

'use strict';

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// Load the User model
var User = require('./db_models.js').User;


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
      console.log('Passport deserializeUser - CHECK user and err');
      done(null, user);
    });
  });

  // Google Strategy
  passport.use(new GoogleStrategy({
    'clientID': '195378471050-agauijdj217rti1dq594it21j30u4vrm.apps.googleusercontent.com',
    'clientSecret': 'kGR7BKpjhrHYba4hiZsGjZ-I',
    'callbackURL': 'http://127.0.0.1:8000/auth/google/callback'
  },
  function(token, refreshToken, profile, done) {
    console.log('Google Strategy Callback');
    // Check database only once we have all our data back
    process.nextTick(function() {
      console.log('Check Database for User');

      User.find({ where: {user_id_google: profile.id} })
        .then(function(user) {
          if (user) {
            console.log('User', user.get({plain:true}).name_google, 'already exists');
            return done(null, user);
          }
          if (user === null) {
            User.create({
              user_id_google: profile.id,
              token_google: token,
              name_google: profile.displayName,
              email_google: profile.emails[0].value
            })
            .then(function(user) {
              console.log('User', user.get({plain:true}).name_google, 'created');

            });
            return done(null, user);
          }
        })
        .error(function(err) {
          return done(err);
        });

    });
  }
  ));

}