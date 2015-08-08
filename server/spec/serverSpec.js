/* 
* @Author: Katrina Uychaco
* @Date:   2015-08-03 20:44:57
* @Last Modified by:   kuychaco
* @Last Modified time: 2015-08-07 22:43:29
*/

'use strict';

var request = require('supertest');
var express = require('express');
var expect = require('chai').expect;
var app = require('../serverSetup.js');

var userController = require('../User/userController.js');


// Test server connection
describe('basic server connection test', function() {
  
  it('is connecting locally', function(done) {
    // Pass in server to supertest
    request(app)
      .get('/')
      .expect(302)
      // Send request to supertest server. 
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });

});

// Test database controllers
describe('database controller function tests', function() {

  // User Controller
  describe('User controller tests', function() {
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
      users.forEach(function(user) {
        userController.checkUserAuth(user.profile, user.token, function(err, user) {
          if (err) return done(err);
        });
      });

      // Get user list and verify users added
      request(app)
        .get('/api/user/list')
        .end(function(err, res) {
          if (err) return done(err);

          expect(res.body.length).to.equal(3);

          expect(res.body.filter(function(user) {
            return user.name_google === 'Katrina Uychaco';
          }).length).to.be.above(0);
          done();
        });

    });
  });

  // Group Controller
    // Create 2 groups
    // Add users to groups
    // Get users in group
    // List groups
    // Delete group
    // Rename group

  // Folder Controller
    // Create 2 new folders
    // Rename folder
    // Create 2 sub folders in a folder
    // Delete folder (and all subfolders inside)

})