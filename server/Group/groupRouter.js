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

  app.route('/:groupId')
    // Send back users in a specific group
    .get(groupController.getGroupMembers)
    // Rename group
    .post(groupController.renameGroup)
    // Delete group
    .delete(groupController.deleteGroup);

  // Add user to group
  app.route('/addUser')
    .post(groupController.addUserToGroup);

};