// Group Spec
// -----------
//
// Unit testing for Group routes and database controller.

var request = require('supertest');
var expect = require('chai').expect;
var app = require('../serverSetup.js');
var Promise = require('bluebird');

var groupController = Promise.promisifyAll(require('./groupController.js'));

module.exports.createGroups = function(callback) {

  // Group Controller
  describe('----- Group Router/Controller tests -----', function() {

    var user_id_google = '102064592924036401703';

    it('should create new groups', function(done) {
      console.log('GROUP CONTROLLER TESTS');
      // Create 2 groups
      var groupNames = ['testGroupA', 'testGroupB'];

      Promise.map(groupNames, function(groupName) {
        return request(app)
          .post('/api/group/create')
          .send({ name: groupName })
          .end(function(err, res) {
            if (err) {
              callback(err);
              return done(err);
            }
            // console.log('RESPONSE', res.body);
            // callback(null, res.body);
          });
      })
      .then(function(groups) {
        // console.log('GROUPS', groups);
        done();
        callback(null, groups);
      })
      .catch(function(err) {
        done(err);
        callback(err);
      });


      // request(app)
      //   .post('/api/group/create')
      //   .send({ name: 'testGroupA' })
      //   .end(function(err, res) {
      //     if (err) {
      //       callback(err);
      //       return done(err);
      //     }
      //     console.log('RESPONSE', res.body);
      //     done();
      //   });

    })


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