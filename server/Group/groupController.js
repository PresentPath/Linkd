// Group Controller
// ----------------
//
// Handle interacting with the Group data in the database.

var Group = require('../config/db_models.js').Group;
var User = require('../config/db_models.js').User;


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

  Group.find( { where: { id: req.body.groupId } } )
  .then(function(group) {
    return group.addUser(req.body.userId);
  })
  .then(function(result) {
    if (result.length>0) {
      console.log('User added to group in database');
    } else {
      console.log('User already in specified group in database');
    }
    res.json(result);
  })
  .error(function(err) {
    console.error('Error in adding user to group in database:', err);
    res.status(500).send(err);
  });
};

// Retrieve memebers in a specific Group instance
module.exports.getGroupMembers = function(req, res, next) {

  Group.find( { where: { id: req.params.groupId }, include: [ User ] } )
  .then(function(group) {
    console.log('Users in specified group retrieved from database:', group.dataValues.Users.map(function(user) {
      return user.dataValues.name_google;
    }));
    res.send(group);
  })
  .error(function(err) {
    console.error('Error retrieving members in group from database:', err);
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
    res.send('Group specified does not exist in database');
  })
  .then(function(group) {
    console.log('Deleted group from database:', group.dataValues.name);
    res.send(group);
  })
  .error(function(err) {
    console.error('Error deleting group from database:', err);
    res.status(500).send(err);
  });

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
    console.log('Renamed group in database:', group.dataValues.name);
    res.send(group);
  })
  .error(function(err) {
    console.error('Error deleting group from database:', err);
    res.status(500).send(err);
  });
};
