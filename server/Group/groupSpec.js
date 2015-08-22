// Group Spec
// -----------
//
// Integration testing for Group routes and database controller.

var request = require('supertest');
var expect = require('chai').expect;
var app = require('../serverSetup.js');
var Promise = require('bluebird');
var Group = require('../config/db_models.js').Group;
var User = require('../config/db_models.js').User;

var testGroups = require('../config/specTestData').testGroups;
var testUsers = require('../config/specTestData').testUsers;


// var groupController = Promise.promisifyAll(require('./groupController.js'));

module.exports = function(callback) {

  // Group Controller
  describe('----- Group Router/Controller tests -----', function() {

    var groupId;

    // Before each test
    // clear out Group table and add testGroupA and testGroupB
    // add users to User table
    beforeEach(function() {

      return Promise.all([ Group.findAll(), User.findAll() ])
        .spread(function(groups, users) {
          var destroyGroups = Promise.map(groups, function(group) {
            return group.destroy();
          });
          var destroyUsers = Promise.map(users, function(user) {
            return user.destroy();
          });
          return Promise.all([ destroyGroups, destroyUsers ]);
        })
        .then(function(destroyed) {
          return User.bulkCreate(testUsers);
        })
        .then(function(users) {
          return Group.bulkCreate(testGroups);
        })
        .then(function(groups) {
          // console.log('Created test groups and users successfully');
          // get groupId for testing
          return Group.find({ where: { name: 'testGroupA' } });
        })
        .then(function(group) {
          groupId = group.id;
        });

    });

    // it('should get group list', function(done) {

    //   // TODO: Cannot test this endpoint without figuring out how to stub req.session.passport.user
    //   request(app)
    //     .get('/api/group/list')
    //     .end(function(err, res) {
    //       if (err) {
    //         return done(err);
    //       }
    //       console.log(res.body);
    //       done();
    //     });
    // });


    it('should create new groups', function(done) {

        request(app)
          .post('/api/group/create')
          .send({
              name: 'testGroupC'
            })
          .end(function(err, res) {
            if (err) {
              callback(err);
              return done(err);
            }
            expect(res.body[0].name).to.equal('testGroupC');
            done();
          });

    });

    it('should add user to group', function(done) {

      var user = testUsers[0];

      request(app)
        .post('/api/group/addUser')
        .send({
            groupId: groupId,
            email: user.email_google
          })
        .end(function(err, res) {
          if (err) {
            callback(err);
            return done(err);
          }
          expect(res.body.GroupId).to.equal(groupId);
          expect(res.body.UserUserIdGoogle).to.equal(user.user_id_google);
          done();
        });


    });

    it('should delete group from database', function(done) {

      request(app)
        .delete('/api/group/'+groupId)
        .end(function(err, res) {
          if (err) {
            callback(err);
            return done(err);
          }
          expect(res.body.id).to.equal(groupId);

          Group.find({ where: {id: groupId } })
            .then(function(group) {
              expect(group).to.equal(null);
              done();
            });
        });

    });

    it('should rename group in database', function(done) {

      request(app)
        .post('/api/group/'+groupId)
        .send({
          name: 'renamedGroup'
        })
        .end(function(err, res) {
          if (err) {
            callback(err);
            return done(err);
          }

          expect(res.body.name).to.equal('renamedGroup');

          Group.find({ where: {name: 'renamedGroup' } })
            .then(function(group) {
              expect(group).to.exist;
              done();
            });
        });

    });

    // Intersting behavior - this block always gets run last, even if it's not at the end of the file.
    describe('--- retrieving group members ---', function() {

      var testUserIds = testUsers.map(function(user) {
              return user.user_id_google;
            });

      beforeEach(function() {
        return Group.find({ where: { id: groupId } })
          .then(function(group) {
            return group.addUsers(testUserIds);
          });
      });

      it('should get group members', function(done) {

        request(app)
          .get('/api/group/'+groupId)
          .end(function(err, res) {
            if (err) {
              callback(err);
              return done(err);
            }
            var users = res.body.map(function(user) {
              return user.user_id_google;
            });
            expect(users.sort()).to.eql(testUserIds);
            done();
          });

      });
    });

    // Tests complete - invoke callback so that next test file can run
    callback();

  });

};

