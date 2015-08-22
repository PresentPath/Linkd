// Folder Spec
// -----------
//
// Integration testing for Folder routes and database controller.

var request = require('supertest');
var expect = require('chai').expect;
var app = require('../serverSetup.js');
var Folder = require('../config/db_models.js').Folder;

var testFolders = require('../config/specTestData.js').testFolders;


module.exports = function(callback) {

  describe('----- Folder Router/Controller tests -----', function() {

    it('sdfsdfds', function(done) {
      done();
    })

  });

  callback();

};