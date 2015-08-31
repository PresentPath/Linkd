// Link Spec
// -----------
//
// Integration testing for Link routes and database controller.

var request = require('supertest');
var expect = require('chai').expect;
var app = require('../serverSetup.js');
var Promise = require('bluebird');
var Folder = require('../config/db_models.js').Folder;
var Group = require('../config/db_models.js').Group;
var User = require('../config/db_models.js').User;
var Link = require('../config/db_models.js').Link;
var deleteInstances = require('../config/helpers.js').deleteInstances;

var testLinks = require('../config/testData.js').testLinks;
var testFolders = require('../config/testData.js').testFolders;
var testGroups = require('../config/testData.js').testGroups;
var testUsers = require('../config/testData.js').testUsers;

module.exports = function(callback) {

  describe('----- Link Router/Controller tests -----', function() {

    var userId;
    // Folders belong to this group
    var groupId;
    // Folder ID to be used for renaming and deleting folder
    var folderId;

    // Before tests, create a user and group for folder to belong to
    before(function() {
     return Promise.all([deleteInstances(User), deleteInstances(Group), deleteInstances(Folder)])
      .then(function(deleted) {
        return User.create(testUsers[0]);
      })
      .then(function(user) {
        userId = user.dataValues.id;
        return Group.create(testGroups[0]);
      })
      .then(function(group) {
        groupId = group.dataValues.id;
        testFolders[0].GroupId = groupId;
        return Folder.create(testFolders[0]);
      })
      .then(function(folder) {
        folderId = folder.dataValues.id;
        testLinks.forEach(function(link) {
          link.FolderId = folderId;
        });
        return Link.bulkCreate(testLinks);
      });
    });

    after(function() {
      return Promise.all([deleteInstances(User), deleteInstances(Group), deleteInstances(Folder), deleteInstances(Link)]);
    });

    xit('should create new link', function(done) {
      done();
    })

    // create link
    // send list for user
    // 

  });

  callback();

};