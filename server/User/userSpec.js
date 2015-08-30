// User Spec
// -----------
//
// Integration testing for User routes and database controller.

var request = require('supertest');
var expect = require('chai').expect;
var app = require('../serverSetup.js');
var Promise = require('bluebird');
var User = require('../config/db_models.js').User;
var deleteInstances = require('../config/helpers.js').deleteInstances;

var testUsers = require('../config/specTestData').testUsers;


module.exports = function(callback) {
  // User Controller
  describe('----- User Router/Controller tests -----', function() {

    before(function() {
      return deleteInstances(User)
        .then(function(affectedRows) {
          return User.bulkCreate(testUsers);
        });
    });

    after(function() {
      return deleteInstances(User);
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
