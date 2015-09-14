/*
* @Author: Katrina Uychaco
* @Date:   2015-08-03 20:44:57
* @Last Modified by:   kuychaco
* @Last Modified time: 2015-08-21 19:20:01
*/

'use strict';

var request = require('supertest');
var expect = require('chai').expect;
var app = require('../serverSetup.js');
var Promise = require('bluebird');
var dbLoaded = require('./db_models.js').dbLoaded;


var userSpec = Promise.promisify(require('../User/userSpec.js'));
var groupSpec = Promise.promisify(require('../Group/groupSpec.js'));
var folderSpec = Promise.promisify(require('../Folder/folderSpec.js'));
var linkSpec = Promise.promisify(require('../Link/linkSpec.js'));
var commentSpec = Promise.promisify(require('../Comment/commentSpec.js'));


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
describe('database controller tests', function() {

  userSpec()
  .then(function() {
    return groupSpec();
  })
  .then(function() {
    return folderSpec();
  })
  .then(function() {
    return linkSpec();
  })
  .then(function() {
    return commentSpec();
  })
  .catch(function(err) {
    console.error('Error testing database controllers:', err);
  });

});
