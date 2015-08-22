// Link Spec
// -----------
//
// Integration testing for Link routes and database controller.

var request = require('supertest');
var expect = require('chai').expect;
var app = require('../serverSetup.js');
var Link = require('../config/db_models.js').Link;

var testLinks = require('../config/specTestData.js').testLinks;


module.exports = function(callback) {

  describe('----- Link Router/Controller tests -----', function() {

    it('sdfsdfds', function(done) {
      done();
    })

  });

  callback();

};