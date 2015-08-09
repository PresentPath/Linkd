// Link Controller
// ---------------
//
// Handle interacting with the Link data in the database.

var Link = require('../config/db_models.js').Link;
var Folder = require('../config/db_models.js').Folder;
var Group = require('../config/db_models.js').Group;
var User = require('../config/db_models.js').User;


module.exports.createLink = function(req, res, next) {

  // Set default expiration date to be 7 days from now
  var date = new Date();
  date.setDate(date.getDate() + 7);

  var newLink;

  Link.findOrCreate( { where: {
    name: req.body.name,
    url: req.body.url,
    expiration_date: req.body.date || date,
    FolderId: req.body.folderId
  } })
  .then(function(link) {
    console.log('Successfully created link in database');
    // Store link in newLink variable - used to associate users w/ link
    newLink = link[0];
    // Send link object back to client as JSON
    res.json(link);
    return Folder.find({
      where: { id: req.body.folderId },
      include: {
        model: Group,
        include: [ User ]
      }
    });
  })
  .then(function(folder) {
    return newLink.addUsers(folder.Group.Users, { viewed: false });
  })
  .then(function(whoknows) {
    console.log('Added', whoknows[0].length, 'user-link associations');
  })
  .error(function(err) {
    console.error('Error in creating new link in database:', err);
    res.status(500).send(err);
  });

};

module.exports.updateExpDate = function(req, res) {

};

module.exports.updateLinkViewedStatus = function(req, res) {

};

module.exports.getLinks = function(req, res) {

};

// Delete a link Instance from the database
module.exports.deleteLink = function(req, res, next) {

  Link.find( { where: { id: req.params.linkId } } )
  .then(function(link) {
    if (link) {
      return link.destroy();
    }
    res.send('link specified does not exist in database');
  })
  .then(function(link) {
    console.log('Deleted link from database:', link.dataValues.name);
    res.send(link);
  })
  .error(function(err) {
    console.error('Error deleting link from database:', err);
    res.status(500).send(err);
  });

};

// Rename link
module.exports.renameLink = function(req, res, next) {

  Link.find( { where: { id: req.params.linkId } } )
  .then(function(link) {
    return link.updateAttributes({
      name: req.body.name
    });
  })
  .then(function(link) {
    console.log('Renamed link in database:', link.dataValues.name);
    res.send(link);
  })
  .error(function(err) {
    console.error('Error deleting link from database:', err);
    res.status(500).send(err);
  });
};