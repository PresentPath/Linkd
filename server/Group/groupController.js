// Group Controller
// ----------------
//
// Handle interacting with the Group data in the database.

var Group = require('../config/db_models.js').Group;

// Retrive list of all Group instances
module.exports.getGroupsList = function(req, res, next) {
  console.log('SessionInfo', req.session.passport.user);
  console.log('UserInfo', req.user);

  Group.findAll({ where: { OwnerUserIdGoogle: req.session.passport.user } })
  .then(function(groups) {
    console.log('Successfully retrieved groups list for user');
    res.json(groups);
  })
  .error(function(err) {
    console.error('Error in retrieving groups list from database', err);
    res.status(500).send(err);
  });

};

// Create a new Group instance in the database based on data sent in the request
module.exports.createGroup = function(req, res, next) {
  console.log('New Group', req.body);

  Group.findOrCreate( { where: {
    name: req.body.name,
    OwnerUserIdGoogle: req.session.passport.user
  } })
  .then(function(group) {
    console.log('Successfully created group in database');
    // Send group object back to client as JSON
    res.json(group);
  })
  .error(function(err) {
    console.error('Error in creating new group in database:', err);
    res.status(500).send(err);
  });

};

// Add a user to a Group
module.exports.addUserToGroup = function(req, res, next) {

};

// Retrieve memebers in a specific Group instance
module.exports.getGroupMembers = function(req, res, next) {

};

// Delete a Group Instance from the database
module.exports.deleteGroup = function(req, res, next) {

};

// Rename Group
module.exports.renameGroup = function(req, res, next) {

};
