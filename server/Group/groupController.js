// Group Controller
// ----------------
//
// Handle interacting with the Group data in the database.

var Group = require('../config/db_models.js').Group;
var User = require('../config/db_models.js').User;
var helpers = require('../config/helpers.js');

// Retrive list of all Group instances
module.exports.getGroupsList = function(req, res, next) {

  User.find({ where: {user_id_google: req.params.userId} })
  .then(function(user) {
    return user.getGroups({ include: [User] });
  })
  .then(helpers.handleSuccess(res, 'Successfully retrieved groups list for user'))
  .error(helpers.handleError(res, 'Error retrieving groups list from database:'));

};

// Create a new Group instance in the database based on data sent in the request
module.exports.createGroup = function(req, res, next) {

  Group.findOrCreate( { where: {
    name: req.body.name,
    OwnerUserIdGoogle: req.body.userId
  } })
  .tap(function(group) {
    // Add user to UserGroup join table
    return group[0].addUser(req.body.userId);
  })
  .then(function(group) {
    return Group.find({ where: { id: group[0].id }, include: [User] });
  })
  .then(helpers.handleSuccess(res, 'Successfully created group in database'))
  .error(helpers.handleError(res, 'Error creating group in database:'));

};

// Add a user to a Group
module.exports.addUserToGroup = function(req, res, next) {

  var userId;
  var successMessage;

  User.find({ where: { email_google: req.body.email } })
  .then(function(user) {
    userId = user.user_id_google;
    return Group.find({ where: { id: req.body.groupId } })
  })
  .then(function(group) {
    return group.addUser(userId);
  })
  .then(function(result) {
    if (result.length>0) {
      successMessage = 'User added to group in database';
    } else {
      successMessage = 'User already in specified group in database';
    }
    return Group.find({ where: { id: req.body.groupId }, include: [User] });
  })
  .then(function(group) {
    return group.Users;
  })
  .then(helpers.handleSuccess(res, successMessage))
  .error(helpers.handleError(res, 'Error adding user to group in database:'));
};

// Retrieve memebers in a specific Group instance
module.exports.getGroupMembers = function(req, res, next) {

  Group.find( { where: { id: req.params.groupId }, include: [ User ] } )
  .then(function(group) {
    return group.dataValues.Users;
  })
  .then(helpers.handleSuccess(res, 'Retrieved members from database'))
  .error(helpers.handleError(res, 'Error retrieving members in group from database:'));

};

// Delete a Group Instance from the database
module.exports.deleteGroup = function(req, res, next) {

  var successMessage;

  Group.find( { where: { id: req.params.groupId } } )
  .then(function(group) {
    if (group) {
      successMessage = 'Deleted group from database';
    } else {
      successMessage = 'Group specified does not exist in database';
    }
    return group && group.destroy();
  })
  .then(helpers.handleSuccess(res, successMessage))
  .error(helpers.handleError(res, 'Error deleting group from database:'));

};

// Rename Group
module.exports.renameGroup = function(req, res, next) {

  Group.find( { where: { id: req.params.groupId } } )
  .then(function(group) {
    return group.updateAttributes({
      name: req.body.name
    });
  })
  .then(helpers.handleSuccess(res, 'Renamed group in database'))
  .error(helpers.handleError(res, 'Error renaming group in database:'));

};
