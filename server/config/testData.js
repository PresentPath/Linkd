// Spec Test Data
// -----------
//
// Fake data for testing all routes and database controllers.

var User = require('./db_models.js').User;
var Group = require('./db_models.js').Group;
var Folder = require('./db_models.js').Folder;
var Link = require('./db_models.js').Link;
var Comment = require('./db_models.js').Comment;


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
    OwnerUserIdGoogle: '1'
  },
  {
    name: 'testGroupB',
    OwnerUserIdGoogle: '1'
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
    name: 'Filipino Cooked'
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

  // Folders belong to this group
  var groupId;
  // Folder ID to be used for renaming and deleting folder
  var folderId;

  // Create users
  // User.bulkCreate(testUsers)
  //   .then(function(users) {
  //     return 
  //   })
}

module.exports.testGroups = testGroups;
module.exports.testUsers = testUsers;
module.exports.testFolders = testFolders;
module.exports.testLinks = testLinks;
module.exports.testComments = testComments;
module.exports.setUpDemoData = setUpDemoData;
