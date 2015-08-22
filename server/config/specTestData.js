'use strict';

var testGroups = [
      {
        name: 'testGroupA',
        OwnerUserIdGoogle: '1'
      },
      {
        name: 'testGroupB',
        OwnerUserIdGoogle: '1'
      }];

var testUsers = [{
      user_id_google: '1',
      name_google: 'testUser1',
      email_google: 'user1@email.com'
    },
    {
      user_id_google: '2',
      name_google: 'testUser2',
      email_google: 'user2@email.com'
    },
    {
      user_id_google: '3',
      name_google: 'testUser3',
      email_google: 'user3@email.com'
    }];

var testFolders = [];
var testLinks = [];
var testComments = [];

module.exports.testGroups = testGroups;
module.exports.testUsers = testUsers;
module.exports.testFolders = testFolders;
module.exports.testLinks = testLinks;
module.exports.testComments = testComments;