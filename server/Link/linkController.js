// Link Controller
// ---------------
//
// Handle interacting with the Link data in the database.

var Link = require('../config/db_models.js').Link;
var Folder = require('../config/db_models.js').Folder;
var Group = require('../config/db_models.js').Group;
var User = require('../config/db_models.js').User;
var UserLinks = require('../config/db_models.js').UserLinks;


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
    console.error('Error in creating new link in database:', err.message);
    res.status(500).send(err.message);
  });

};

module.exports.updateExpDate = function(req, res) {

  Link.find( { where: { id: req.params.linkId } } )
  .then(function(link) {
    return link.updateAttributes({
      name: req.body.expDate
    });
  })
  .then(function(link) {
    console.log('Updated link expiration date in database for', link.dataValues.name) + ':', link.dataValues.expiration_date;
    res.send(link);
  })
  .error(function(err) {
    console.error('Error updating link expiration date in database:', err.message);
    res.status(500).send(err.message);
  });
};

module.exports.updateLinkViewedStatus = function(req, res) {

  UserLinks.find({ where: { LinkId: req.params.linkId, UserUserIdGoogle: req.body.userId }})
  .then(function(userLink) {
    return userLink.updateAttributes({ viewed: 1 });
  })
  .then(function(userLink) {
    console.log('Updated viewed status in database', userLink.dataValues);
    res.send(userLink);
  })
  .error(function(err) {
    console.error('Error retrieving links from database:', err.message);
    res.status(500).send(err.message);
  });
};

module.exports.getLinksForUser = function(req, res) {

  User.find({ where: { user_id_google: req.params.userId }, include: Link})
  .then(function(userLinks) {
    console.log('Retrieved links from database for userId', req.params.userId);
    res.send(userLinks.Links);
  })
  .error(function(err) {
    console.error('Error retrieving links for user from database:', err.message);
    res.status(500).send(err.message);
  });

};

module.exports.getLinksForFolder = function(req, res) {

  Link.findAll( { where: { FolderId: req.params.folderId } } )
  .then(function(links) {
    console.log('Retrieved links from database with FolderId:', req.params.folderId);
    res.send(links);
  })
  .error(function(err) {
    console.error('Error retrieving links from database:', err.message);
    res.status(500).send(err.message);
  });
};

module.exports.getLinkInfo = function(req, res) {

  Link.find( { where: { id: req.params.linkId } } )
  .then(function(link) {
    console.log('Retrieved link info from database:', link.dataValues);
    res.send(link);
  })
  .error(function(err) {
    console.error('Error retrieving link info from database:', err.message);
    res.status(500).send(err.message);
  });

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
    console.error('Error deleting link from database:', err.message);
    res.status(500).send(err.message);
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
    console.error('Error deleting link from database:', err.message);
    res.status(500).send(err.message);
  });
};