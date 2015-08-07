/* 
* @Author: Katrina Uychaco
* @Date:   2015-08-05 17:46:59
* @Last Modified by:   Katrina Uychaco
* @Last Modified time: 2015-08-06 21:18:58
*/

'use strict';

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// Load the User model
var User = require('./db_models.js').User;

var googleOptions = process.env.PORT ? 
  {
    'clientID': '195378471050-agauijdj217rti1dq594it21j30u4vrm.apps.googleusercontent.com',
    'clientSecret': 'kGR7BKpjhrHYba4hiZsGjZ-I',
    'callbackURL': 'http://linkd.herokuapp.com/auth/google/callback'
  } :
  {
    'clientID': '195378471050-o9i2qjic5sq2395plkfclse8fdl2quse.apps.googleusercontent.com',
    'clientSecret': 'kdaGt5vgxToQAKIlrCAH4tJK',
    'callbackURL': 'http://127.0.0.1:8000/auth/google/callback'
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