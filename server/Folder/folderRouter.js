// Folder Router
// -----------
//
// This router further routes any requests sent to the /api/folder path.
// The Folder controller exposes methods for interacting with the Folder data in the database.

var folderController = require('./folderController.js');

module.exports = function(app) {

  // Send list of sub folders
  app.route('/subfolders/:folderId')
    .get(folderController.getSubFolders);

  // Create new folder
  app.route('/create')
    .post(folderController.createFolder);

  // Delete folder
  app.route('/delete/:folderId')
    .delete(folderController.deleteFolder);

  // Rename folder
  app.route('/rename/:folderId')
    .post(folderController.renameFolder);

};