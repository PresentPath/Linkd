// Group Router
// -----------
//
// This router further routes any requests sent to the /api/group path.
// The Group controller exposes methods for interacting with the Group data in the database.

var groupController = require('./groupController.js');

module.exports = function(app) {

  // Send back groups
  app.route('/list')
    .get(groupController.getGroupsList);

  // Create group
  app.route('/create')
    .post(groupController.createGroup);

  // Send back users in a specific group
  app.route('/:groupId')
    .get(groupController.getGroupMembers);

  // Add user to group
  app.route('/addUser/:groupId/:userId')
    .post(groupController.addUserToGroup);

  // Delete group
  // TODO: Research DELETE HTTP method
  app.route('/delete/:groupId')
    .get(groupController.deleteGroup);

  // Rename group
  app.route('/rename/:groupId')
    .post(groupController.renameGroup);

};