// Folder Router
// -----------
//
// This router further routes any requests sent to the /api/folder path.
// The Folder controller exposes methods for interacting with the Folder data in the database.

var folderController = require('./folderController.js');

module.exports = function(app) {

  // Create new folder
  app.route('/create')
    .post(folderController.createFolder);

  app.route('/group/:groupId')
    // Send list of group's folders
    .get(folderController.getGroupFolders);

  app.route('/:folderId')
    // Rename folder
    .post(folderController.renameFolder)
    // Delete folder
    .delete(folderController.deleteFolder);


};