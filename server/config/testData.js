// Spec Test Data
// -----------
//
// Fake data for testing all routes and database controllers.

var User = require('./db_models.js').User;
var Group = require('./db_models.js').Group;
var Folder = require('./db_models.js').Folder;
var Link = require('./db_models.js').Link;
var Comment = require('./db_models.js').Comment;
var deleteInstances = require('./helpers.js').deleteInstances;

var Promise = require('bluebird');

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

var testGroups = [
  {
    name: 'cookingBuddies'
  },
  {
    name: 'exerciseBuddies'
  },
  {
    name: 'hackingBuddies'
  }];

var testFolders = [{
    name: 'Filipino'
  },
  {
    name: 'Mexican'
  },
  {
    name: 'Estonian'
  },
  {
    name: 'Filipino-Cooked',
    parentFolder: 'Filipino'
  }];

var testLinks = [
  {
    name: 'Chicken adobo',
    url: 'http://m.allrecipes.com/recipe/128699/famous-chicken-adobo/?mxt=t06rda',
    parentFolder: 'Filipino-Cooked'
  },
  {
    name: 'Pancit',
    url: 'http://m.allrecipes.com/recipe/47015/quick-and-easy-pancit/?mxt=t06rda',
    parentFolder: 'Filipino'
  },
  {
    name: 'Crock pot carnitas',
    url: 'http://www.food.com/recipe/crock-pot-carnitas-326866',
    parentFolder: 'Mexican'
  },
  {
    name: 'Beet and potato salad',
    url: 'http://estoniancooking.blogspot.com/2011/07/rosolje-beet-and-potato-salad.html',
    parentFolder: 'Estonian'
  }
];

var testComments = [
  {
    text: 'yummmmmmm',
    linkName: 'Chicken adobo'
  },
  {
    text: 'let\'s do it!!',
    linkName: 'Chicken adobo'
  },
  {
    text: 'where should we get the ingredients?',
    linkName: 'Chicken adobo'
  }
];


function setUpDemoData () {
  console.log('set up demo data');

  // All app data is for this user
  var userId;
  // Folders belong to this group
  var groupId;

  var groupInstance;

  // Clear database
  return Promise.each([User, Group, Folder, Link, Comment], function(Model) {
    return deleteInstances(Model);
  })
  // Create user
  .then(function(deleted) {
    return User.create(testUsers[0]);
  })
  .tap(function(user) {
    User.bulkCreate(testUsers.slice(1));
  })
  .then(function(user) {
    userId = user.dataValues.user_id_google;
    testGroups[0].OwnerUserIdGoogle = userId;
    return Group.create(testGroups[0]);
  })
  .tap(function(group) {
    return group.addUser(userId);
  })
  .then(function(group) {
    groupInstance = group;
    return Folder.create({
        name: group.name,
        isRoot: true,
        ParentId: null,
        GroupId: group.id
      });
  })
  .then(function(folderInstance) {
    groupId = groupInstance.dataValues.id;
    // Create folder
    testFolders.forEach(function(folder) {
      folder.GroupId = groupId;
      folder.ParentId = folderInstance.id;
    });
    return Folder.bulkCreate(testFolders);
  })
  .then(function(folder) {
    var subFolders = testFolders.filter(function(folder) {
      return folder.parentFolder;
    });
    return Promise.map(subFolders, function(subFolder) {
      var subFolderPromise = Folder.find({ where: { name: subFolder.name } });
      var parentFolderPromise = Folder.find({ where: { name: subFolder.parentFolder } });
      return Promise.all([subFolderPromise, parentFolderPromise])
        .spread(function(subFolder, parentFolder) {
          return subFolder.update({ ParentId: parentFolder.id });    
        });
    });
  })
  .then(function() {
    return Promise.map(testLinks, function(link) {
      return Folder.find({ where: { name: link.parentFolder } }).
        then(function(parentFolder) {
          link.FolderId = parentFolder.id;
          delete link.parentFolder;
        });
    });
  })
  .then(function() {
    return Promise.map(testLinks, function(link) {
      return Link.create(link);
    });
  })
  .then(function(links) {
    return Promise.map(links, function(link) {
      return link.addUser(userId, {viewed: false});
    });
  })
  .then(function() {
    return Promise.map(testComments, function(comment) {
      return Link.find({ where: { name: comment.linkName } }).
        then(function(link) {
          comment.UserUserIdGoogle = userId;
          comment.GroupId = groupId;
          comment.LinkId = link.id;
          delete comment.linkName;
        });
    });
  })
  .then(function() {
    return Comment.bulkCreate(testComments);
  })
  .then(function(comments) {
    return 'Successfully loaded demo data!';
  })
  .catch(function(err) {
    return console.error('Error loading demo data:', err.message);
  });
}

module.exports.testGroups = testGroups;
module.exports.testUsers = testUsers;
module.exports.testFolders = testFolders;
module.exports.testLinks = testLinks;
module.exports.testComments = testComments;
module.exports.setUpDemoData = setUpDemoData;
