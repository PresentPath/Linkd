// User Spec
// -----------
//
// Unit testing for User routes and database controller.

var request = require('supertest');
var expect = require('chai').expect;
var app = require('../serverSetup.js');
var Promise = require('bluebird');
var User = require('../config/db_models.js').User;

var testUsers = require('../config/specTestData').testUsers;


module.exports = function(callback) {
  // User Controller
  describe('----- User Router/Controller tests -----', function() {

    before(function(done) {

      User.findAll()
        .then(function(users){
          return Promise.map(users, function(user){
            return user.destroy();
          });
        })
        .then(function(affectedRows) {
          return User.bulkCreate(testUsers);
        })
        .then(function(users) {
          console.log('Created test users successfully');
          done();
        })
        .error(function(err) {
          console.error(err.message);
          done(err.message);
        });

    });

    // Add 3 users to database
    it('should retrieve users from the database', function(done) {

        // Get user list and verify users added
        request(app)
          .get('/api/user/list')
          .end(function(err, res) {
            if (err) {
              callback(err);
              return done(err);
            }

            expect(res.body.length).to.equal(3);

            expect(res.body.filter(function(user) {
              return user.name_google === 'testUser1';
            }).length).to.be.above(0);
            callback();
            done();
          });

    });
  });

};
