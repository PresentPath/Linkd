// Folder Router
// -----------
//
// This router further routes any requests sent to the /api/folder path.
// The Folder controller exposes methods for interacting with the Folder data in the database.

var folderController = require('./folderController.js');

module.exports = function(app) {

  app.route('/:folderId')
    // Send list of sub folders
    .get(folderController.getSubFolders);
    // Rename folder
    .post(folderController.renameFolder);
    // Delete folder
    .delete(folderController.deleteFolder);

  // Create new folder
  app.route('/create')
    .post(folderController.createFolder);

};