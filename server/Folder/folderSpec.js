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
var deleteInstances = require('../config/helpers.js').deleteInstances;


var testFolders = require('../config/specTestData.js').testFolders;
var testGroups = require('../config/specTestData.js').testGroups;
var testUsers = require('../config/specTestData.js').testUsers;


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
        console.log(group.id);
        return groupId = group.id;
      });
    });


    // Before each test create new folders in database
    beforeEach(function() {

      testFolders = testFolders.map(function(folder) {
        folder.GroupId = groupId;
        return folder;
      });
      return deleteInstances(Folder)
        .then(function(destroyed) {
          return Folder.create(testFolders[0]);
        })
        .then(function(folder) {
          folderId = folder.dataValues.id;
          return Folder.bulkCreate(testFolders.slice(1));
        });
    });

    after(function() {
      return Promise.all([deleteInstances(User), deleteInstances(Group), deleteInstances(Folder)]);
    });

    it('should create a root-level folder', function(done) {
      request(app)
        .post('/api/folder/create')
        .send({
          name: 'testFolderW',
          groupId: groupId,
          parentId: null
        })
        .end(function(err, res) {
          if (err) {
            callback(err);
            return done(err);
          }
          expect(res.body.name).to.equal('testFolderW');
          Folder.find({ where: 
              { 
                name: 'testFolderW',
                GroupId: groupId,
                ParentId: null 
              } 
            })
            .then(function(folder) {
              expect(folder).to.exist;
              done();
            });
        });

    });

    it('should create a nested folder', function(done) {
      request(app)
        .post('/api/folder/create')
        .send({
          name: 'childFolder',
          parentId: folderId,
          groupId: groupId
        })
        .end(function(err, res) {
          if (err) {
            callback(err);
            return done(err);
          }
          expect(res.body.name).to.equal('childFolder');
          Folder.find({ where: 
              { 
                name: 'childFolder',
                GroupId: groupId,
                ParentId: folderId 
              } 
            })
            .then(function(folder) {
              expect(folder).to.exist;
              done();
            });
        });

    });

    it('should get list of group\'s folders', function(done) {
      request(app)
        .get('/api/folder/group/'+groupId)
        .end(function(err, res) {
          if (err) {
            callback(err);
            return done(err);
          }
          var responseFolders = res.body.map(function(folder) {
            return folder.name;
          }).sort();
          var expectedFolders = testFolders.map(function(folder) {
            return folder.name;
          }).sort();
          expect(responseFolders).to.eql(expectedFolders);
          done();
        });

    });

    it('should delete folder from database', function(done) {

      request(app)
        .delete('/api/folder/'+folderId)
        .end(function(err, res) {
          if (err) {
            callback(err);
            return done(err);
          }

          expect(res.body.id).to.equal(folderId);

          Folder.find({ where: {id: folderId } })
            .then(function(folder) {
              expect(folder).to.equal(null);
              done();
            });
        });

    });

    it('should rename folder in database', function(done) {

      request(app)
        .post('/api/folder/'+folderId)
        .send({
          name: 'renamedFolder'
        })
        .end(function(err, res) {
          if (err) {
            callback(err);
            return done(err);
          }

          expect(res.body.name).to.equal('renamedFolder');

          Folder.find({ where: {name: 'renamedFolder' } })
            .then(function(folder) {
              expect(folder).to.exist;
              done();
            });
        });

    });

    callback();
  });


};