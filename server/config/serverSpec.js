/*
* @Author: Katrina Uychaco
* @Date:   2015-08-03 20:44:57
* @Last Modified by:   kuychaco
* @Last Modified time: 2015-08-13 22:29:32
*/

'use strict';

var request = require('supertest');
var expect = require('chai').expect;
var app = require('../serverSetup.js');
var Promise = require('bluebird');
var dbLoaded = require('./db_models.js').dbLoaded;


var userSpec = Promise.promisify(require('../User/userSpec.js'));
var groupSpec = Promise.promisify(require('../Group/groupSpec.js'));


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

  // var checkDBStatus = Promise.promisify(function(callback) {
  //   if (dbLoaded) {
  //     console.log('db loaded');
  //     return callback(null, 'DB loaded');
  //   }
  //   console.log('recursive call for checkDBStatus');
  //   setTimeout(checkDBStatus.bind(null,callback), 100);
  // });


  // checkDBStatus()
  // .then(function(res) {
  //   console.log(res)
  //   return userSpec();
  // })

  userSpec()
  .then(function() {
    return groupSpec();
  })
  // .then(function() {
  //   return folderSpec();
  // })
  // .then(function() {
  //   return linkSpec();
  // })
  // .then(function() {
  //   return commentSpec();
  // })
  .catch(function(err) {
    console.error('Error testing database controllers:', err);
  });



  // Group Controller
  // describe('Group Controller tests', function() {
  //   console.log('GROUP CONTROLLER TESTS');
    // Create 2 groups
    // it('should create groups', function(done) {
    //   app.
    // });

    // Add users to groups
    // Get users in group
    // List groups
    // Delete group
    // Rename group

  // });

  // Folder Controller
    // Create 2 new folders
    // Rename folder
    // Create 2 sub folders in a folder
    // Delete folder (and all subfolders inside)

});
