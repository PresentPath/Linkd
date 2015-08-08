// Group Spec
// -----------
//
// Unit testing for Group routes and database controller.

var request = require('supertest');
var expect = require('chai').expect;
var app = require('../serverSetup.js');
var Promise = require('bluebird');

var groupController = Promise.promisifyAll(require('./groupController.js'));

module.exports = function(callback) {

  // Group Controller
  describe('----- Group Router/Controller tests -----', function() {

    var user_id_google = '102064592924036401703';

    console.log('GROUP CONTROLLER TESTS');
    // Create 2 groups
    // request(app)
    //   .post('/api/group/create')
    //   .field('name', 'testGroup')
    //   .end(function(err, res) {
    //     if (err) return done(err);
    //     console.log('RESPONSE', res);
    //   });

    // it('should create groups', function(done) {
    //   app.
    // });

    // Add users to groups
    // Get users in group
    // List groups
    // Delete group
    // Rename group

  });

};