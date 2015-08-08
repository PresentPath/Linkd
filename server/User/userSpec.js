// User Spec
// -----------
//
// Unit testing for User routes and database controller.

var request = require('supertest');
var expect = require('chai').expect;
var app = require('../serverSetup.js');
var Promise = require('bluebird');

var userController = Promise.promisifyAll(require('./userController.js'));

module.exports = function(callback) {

  // User Controller
  describe('----- User Router/Controller tests -----', function() {
    // Add 3 users to database
    it('should add and retrieve users from the database', function(done) {

      // Fake user data
      var users = [
        {
          profile: {
            id: '102064592924036401703',
            displayName: 'Katrina Uychaco',
            emails: [{ value: 'kuychaco@gmail.com' }]
          },
          token: 'ya29.yQH7RHzsmcgSg0kI_eSLniVA14lXL6kaK8fQwuWiUOk-IyeosYDs3tBagxJYrJeS95_GJg'
        },
        {
          profile: {
            id: '103256925994420229365',
            displayName: 'Katrina Uychaco',
            emails: [{ value: 'uychacok@gmail.com' }]
          },
          token: 'ya29.yQF874WkXayqM7cLgNjbum_P4k2NojVzTQ6OInoQEorrnItI2NGM5_6ul4OaulXpSqKK'
        },
        {
          profile: {
            id: '108778785915485593543',
            displayName: 'Katrina Uychaco',
            emails: [{ value: 'katrina.uychaco@telegraphacademy.com' }]
          },
          token: 'ya29.yQHaRmj6uzDFAllN-p0gzOLSEW9y0z8xmXT3WtNgKizpF_QtHjd5WoU7ksTVGtXPh_Qg'
        },
      ];

      // Add users to database
      Promise.map(users, function(user) {
        return userController.checkUserAuthAsync(user.profile, user.token);
      })
      .then(function(users) {
        // console.log(users);

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
            callback(null, 'User Controller tests complete');
          });
      })
      .catch(function(err) {
        done(err);
        callback(err);
      });

    });
  });

};
