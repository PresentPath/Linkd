// User Spec
// -----------
//
// Unit testing for User routes and database controller.

var request = require('supertest');
var expect = require('chai').expect;
var app = require('../serverSetup.js');
var Promise = require('bluebird');
var User = require('../config/db_models.js').User;

// User Controller
describe('----- User Router/Controller tests -----', function() {

  before(function(done) {
    // Fake user data
    var users = [
      {
        user_id_google: '102064592924036401703',
        name_google: 'Katrina Uychaco',
        email_google: 'kuychaco@gmail.com',
        token_google: 'ya29.yQH7RHzsmcgSg0kI_eSLniVA14lXL6kaK8fQwuWiUOk-IyeosYDs3tBagxJYrJeS95_GJg'
      },
      {
        user_id_google: '103256925994420229365',
        name_google: 'Katrina Uychaco',
        email_google: 'uychacok@gmail.com',
        token_google: 'ya29.yQF874WkXayqM7cLgNjbum_P4k2NojVzTQ6OInoQEorrnItI2NGM5_6ul4OaulXpSqKK'
      },
      {
        user_id_google: '108778785915485593543',
        name_google: 'Katrina Uychaco',
        email_google: 'katrina.uychaco@telegraphacademy.com',
        token_google: 'ya29.yQHaRmj6uzDFAllN-p0gzOLSEW9y0z8xmXT3WtNgKizpF_QtHjd5WoU7ksTVGtXPh_Qg'
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
          }

          expect(res.body.length).to.equal(3);

          expect(res.body.filter(function(user) {
            return user.name_google === 'Katrina Uychaco';
          }).length).to.be.above(0);
          done();
        });
    // })
    // .catch(function(err) {
    //   done(err);
    // });

  });
});
