// Folder Spec
// -----------
//
// Integration testing for Folder routes and database controller.

var request = require('supertest');
var expect = require('chai').expect;
var app = require('../serverSetup.js');
var Promise = require('bluebird');
var Folder = require('../config/db_models.js').Folder;
var Group = require('../config/db_models.js').Group;
var User = require('../config/db_models.js').User;


var testFolders = require('../config/specTestData.js').testFolders;
var testGroups = require('../config/specTestData.js').testGroups;
var testUsers = require('../config/specTestData.js').testUsers;

var deleteInstances = function(Model) {
  console.log('!!!!!!!!delete')
  return Model.findAll()
    .then(function(instances) {
      return instances.map(function(instance) {
        return instance.destroy();
      });
    });
};

module.exports = function(callback) {

  describe('----- Folder Router/Controller tests -----', function() {

    // Folders belong to this group
    var groupId;
    // Folder ID to be used for renaming and deleting folder
    var folderId;

    // Before tests, create a user and group for folder to belong to
    before(function() {
      return Promise.all([deleteInstances(User), deleteInstances(Group)])
        .then(function(deleted) {
          return User.create(testUsers[0]);
        })
        .then(function(user) {
          return Group.create(testGroups[0]);
        })
        .then(function(group) {
          return groupId = group.id;
        })
        // .then(function() {
        //   return Folder.create(testFolders[0]);
        // });
    });

    // Before each test create new folders in database
    beforeEach(function() {

      testFolders = testFolders.map(function(folder) {
        return folder.GroupId = groupId;
      });

      return deleteInstances(Folder)
        .then(function(destroyed) {
          console.log('FOLDER', typeof Folder.create);
          return Folder.create(testFolders[0]);
        })
        .then(function(folder) {
          console.log('FOLSERS', folder);
        });
    });

    it('should create a folder', function(done) {
      // console.log('GROUPID', groupId);
      // request(app)
      //   .post('/api/folder/create')
      //   .send({
      //     name: 'testFolderW'
      //   })
      //   .end(function(err, res) {
      //     if (err) {
      //       callback(err);
      //       return done(err);
      //     }
      //     expect(res.body.name).to.equal('testFolderW');
      //     Folder.find({ where: { name: 'testFolderW' } })
      //       .then(function(folder) {
      //         expect(folder).to.exist;
      //         done();
      //       });
      //   });

    })






    // callback();
  });


};