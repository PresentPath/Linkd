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
    name: 'cookingBuddies',
  },
  {
    name: 'exerciseBuddies',
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
    name: 'Filipino-Cooked'
  }];

var testLinks = [
  {
    name: 'Chicken adobo',
    url: 'http://m.allrecipes.com/recipe/128699/famous-chicken-adobo/?mxt=t06rda'
  },
  {
    name: 'Pancit',
    url: 'http://m.allrecipes.com/recipe/47015/quick-and-easy-pancit/?mxt=t06rda'
  },
  {
    name: 'Crock pot carnitas',
    url: 'http://www.food.com/recipe/crock-pot-carnitas-326866'
  },
  {
    name: 'Beet and potato salad',
    url: 'http://estoniancooking.blogspot.com/2011/07/rosolje-beet-and-potato-salad.html'
  }
];

var testComments = [
  {
    text: 'yummmmmmm'
  },
  {
    text: 'let\'s do it!!'
  },
  {
    text: 'where should we get the ingredients?'
  }
];


function setUpDemoData () {
  console.log('set up demo data');

  // All app data is for this user
  var userId;
  // Folders belong to this group
  var groupId;
  // Folder ID to be used for renaming and deleting folder
  var folderId;
  // Link ID to be used for comments
  var linkId;

  // Clear database
  return Promise.all([
    deleteInstances(User),
    deleteInstances(Group),
    deleteInstances(Folder),
    deleteInstances(Link),
    deleteInstances(Comment)
  ])
  // Create user
  .then(function(deleted) {
    console.log('1')
    return User.create(testUsers[0]);
  })
  .then(function(user) {
    console.log('2')
    userId = user.dataValues.user_id_google;
    testGroups[0].OwnerUserIdGoogle = userId;
    return Group.create(testGroups[0]);
  })
  .tap(function(group) {
    return group.addUser(userId);
  })
  .then(function(group) {
    console.log('3')
    groupId = group.dataValues.id;
    // Create folder
    testFolders.forEach(function(folder) {
      folder.GroupId = groupId;
    });
    return Folder.create(testFolders[0]);
  })
  .then(function(folder) {
    console.log('4')
    folderId = folder.dataValues.id;
    testFolders.forEach(function(folder) {
      if(folder.name === 'Filipino-Cooked') {
        folder.ParentId = folderId;
      }
    });
    return Folder.bulkCreate(testFolders.slice(1));
  })
  .then(function(folders) {
    console.log('5')
    testLinks.forEach(function(link) {
      link.FolderId = folderId;
    });
    return Link.create(testLinks[0]);
  })
  .then(function(link) {
    linkId = link.dataValues.id;
    return link.addUser(userId, {viewed: false});
  })
  // .then(function(link) {
  //   console.log('6')
  //   linkId = link.dataValues.id;
  //   return Link.bulkCreate(testLinks.slice(1));
  // })
  // .then(function(links) {
  //   return links.map(function(link) {
  //     return link.addUser(userId, {viewed: false});
  //   });
  // })
  .then(function() {
    console.log('7')
    testComments.forEach(function(comment) {
      comment.AuthorUserIdGoogle = userId;
      comment.GroupId = groupId;
      comment.LinkId = linkId;
    });
    return Comment.bulkCreate(testComments);
  })
  .then(function(comments) {
    console.log('8')
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