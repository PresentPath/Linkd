// Folder Controller
// -----------------
//
// Handle interacting with the Folder data in the database.

var Folder = require('../config/db_models.js').Folder;
var helpers = require('../config/helpers.js');

// Retrieve list of folders for a given group
// Client will handle logic to display one folder level at a time
module.exports.getGroupFolders = function(req, res, next) {

  Folder.findAll( { where: { GroupId: req.params.groupId } } )
  .then(function(folders) {
    console.log('Successfully retrieved subfolders from database');
    // Send folder object back to client as JSON
    res.json(folders);
  })
  .error(function(err) {
    console.error('Error retrieving subfolders from database:', err);
    res.status(500).send(err);
  });
};

// Create a new folder instance in the database
module.exports.createFolder = function(req, res, next) {

  Folder.findOrCreate( { where: {
    name: req.body.name,
    ParentId: req.body.parentId,
    GroupId: req.body.groupId
  } })
  .then(function(folder) {
    console.log('Successfully created folder in database');
    // Send folder object back to client as JSON
    folder[0].ParentId = parseInt(folder[0].ParentId);
    res.json(folder[0]);
  })
  .error(function(err) {
    console.error('Error in creating new folder in database:', err);
    res.status(500).send(err);
  });
};

// Delete a Folder Instance from the database
module.exports.deleteFolder = function(req, res, next) {

  var successMessage;

  // TODO: Recursively delete all children folders
  Folder.destroy({ where: { ParentId: req.params.folderId } })
  .then(function(affectedRows) {
    console.log('Deleted', affectedRows, 'subfolders from database');
    return Folder.find( { where: { id: req.params.folderId } } );
  })
  .then(function(folder) {
    if (folder) {
      successMessage = 'Deleted folder from database';
    } else {
      successMessage = 'Folder specified does not exist in database';
    }
    return folder && folder.destroy();
  })
  .then(helpers.handleSuccess(res, successMessage))
  .error(helpers.handleError(res, 'Error deleting folder from database:'));

};

// Rename Folder
module.exports.renameFolder = function(req, res, next) {

  Folder.find( { where: { id: req.params.folderId } } )
  .then(function(folder) {
    return folder.updateAttributes({
      name: req.body.name
    });
  })
  .then(function(folder) {
    console.log('Renamed folder in database:', folder.dataValues.name);
    res.send(folder);
  })
  .error(function(err) {
    console.error('Error deleting folder from database:', err);
    res.status(500).send(err);
  });
};
