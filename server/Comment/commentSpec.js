// Comment Spec
// -----------
//
// Integration testing for Comment routes and database controller.

var request = require('supertest');
var expect = require('chai').expect;
var app = require('../serverSetup.js');
var Comment = require('../config/db_models.js').Comment;

var testComments = require('../config/testData.js').testComments;


module.exports = function(callback) {

  describe('----- Comment Router/Controller tests -----', function() {

    xit('should pass all tests', function(done) {
      done();
    })

  });

  callback();

};