// Group Controller
// ----------------
//
// Handle interacting with the Group data in the database.

var Group = require('../config/db_models.js').Group;
var User = require('../config/db_models.js').User;
var helpers = require('../config/helpers.js');

// Retrive list of all Group instances
module.exports.getGroupsList = function(req, res, next) {

  User.find({ where: {user_id_google: req.session.passport.user} })
  .then(function(user) {
    return user.getGroups();
  })
  .then(function(groups) {
    // console.log('Successfully retrieved groups list for user');
    res.json(groups);
  })
  .error(function(err) {
    // console.error('Error in retrieving groups list from database', err);
    res.status(500).send(err);
  });

};

// Create a new Group instance in the database based on data sent in the request
module.exports.createGroup = function(req, res, next) {
  // console.log('New Group', req.body);

  Group.findOrCreate( { where: {
    name: req.body.name,
    OwnerUserIdGoogle: req.session.passport.user
  } })
  .then(function(group) {
    // console.log('Successfully created group in database');
    // Add user to UserGroup join table
    group[0].addUser(req.session.passport.user);
    // Send group object back to client as JSON
    res.json(group);
  })
  // .error(function(err) {
  //   console.error('Error in creating new group in database:', err);
  //   res.status(500).send(err);
  // });
  .error(helpers.handleError(res, 'Error in creating group in database'));

};

// Add a user to a Group
module.exports.addUserToGroup = function(req, res, next) {
  var userId;

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
      // console.log('User added to group in database');
    } else {
      // console.log('User already in specified group in database');
    }
    res.json(result[0][0]);
  })
  .error(function(err) {
    // console.error('Error in adding user to group in database:', err);
    res.status(500).send(err);
  });
};

// Retrieve memebers in a specific Group instance
module.exports.getGroupMembers = function(req, res, next) {

  Group.find( { where: { id: req.params.groupId }, include: [ User ] } )
  .then(function(group) {
    res.send(group.dataValues.Users);
  })
  .error(function(err) {
    // console.error('Error retrieving members in group from database:', err);
    res.status(500).send(err);
  });

};

// Delete a Group Instance from the database
module.exports.deleteGroup = function(req, res, next) {

  Group.find( { where: { id: req.params.groupId } } )
  .then(function(group) {
    if (group) {
      return group.destroy();
    }
    // res.send('Group specified does not exist in database');
    return 'Group specified does not exist in database';
  })
  // .then(function(group) {
  //   console.log('Deleted group from database');
  //   res.send(group);
  // })
  .then(helpers.handleSuccess(res, 'Deleted group from database'))
  .error(helpers.handleError(res, 'Error deleting group from database:'));
  // .error(function(err) {
  //   console.error('Error deleting group from database:', err);
  //   res.status(500).send(err);
  // });

};

// Rename Group
module.exports.renameGroup = function(req, res, next) {

  Group.find( { where: { id: req.params.groupId } } )
  .then(function(group) {
    return group.updateAttributes({
      name: req.body.name
    });
  })
  .then(function(group) {
    // console.log('Renamed group in database:', group.dataValues.name);
    res.send(group);
  })
  .error(function(err) {
    // console.error('Error deleting group from database:', err);
    res.status(500).send(err);
  });
};
