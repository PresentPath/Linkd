// User Spec
// -----------
//
// Unit testing for User routes and database controller.

var request = require('supertest');
var expect = require('chai').expect;
var app = require('../serverSetup.js');
var Promise = require('bluebird');
var User = require('../config/db_models.js').User;

module.exports = function(callback) {
  // User Controller
  describe('----- User Router/Controller tests -----', function() {

    before(function(done) {
      // Fake user data
      var users = [
        {
          user_id_google: '1',
          name_google: 'Katrina Uychaco',
          email_google: 'kuychaco@gmail.com'
        },
        {
          user_id_google: '2',
          name_google: 'Katrina Uychaco',
          email_google: 'uychacok@gmail.com'
        },
        {
          user_id_google: '3',
          name_google: 'Katrina Uychaco',
          email_google: 'katrina.uychaco@telegraphacademy.com'
        }
      ];


      User.findAll()
        .then(function(users){
          return Promise.map(users, function(user){
            return user.destroy();
          });
        })
        .then(function(affectedRows) {
          return User.bulkCreate(users);
        })
        .then(function(users) {
          console.log('Created test users successfully');
          done();
        })
        .error(function(err) {
          console.error(err.message);
          done(err);
        });

    });

    // Add 3 users to database
    it('should add and retrieve users from the database', function(done) {


      // Add users to database
      // Promise.map(users, function(user) {
      //   return userController.checkUserAuthAsync(user.profile, user.token);
      // })
      // .then(function(users) {
      //   // console.log(users);

        // Get user list and verify users added
        request(app)
          .get('/api/user/list')
          .end(function(err, res) {
            if (err) {
              done(err);
              callback(err);
            }

            expect(res.body.length).to.equal(3);

            expect(res.body.filter(function(user) {
              return user.name_google === 'Katrina Uychaco';
            }).length).to.be.above(0);
            done();
            callback(null, 'Completed user tests');
          });
      // })
      // .catch(function(err) {
      //   done(err);
      // });

    });
  });

};
