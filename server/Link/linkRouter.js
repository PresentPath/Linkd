// Link Router
// -----------
//
// This router further routes any requests sent to the /api/link path.
// The Link controller exposes methods for interacting with the Link data in the database.

var linkController = require('./linkController.js');


module.exports = function(app) {

  // Create new link
  app.route('/create')
    .post(linkController.createLink);

  // Create new link from chrome plugin
  app.route('/plugin/create')
    .post(linkController.createLinkFromPlugin);

  // Send list of links for user
  app.route('/user/:userId')
    .get(linkController.getLinksForUser);
  
  // Send list of links in folder
  app.route('/folder/:folderId')
    .get(linkController.getLinksForFolder);

  // Change link expiration date
  app.route('/:linkId/expDate')
    .post(linkController.updateExpDate);

  // Change link viewed status
  app.route('/:linkId/viewed')
    .post(linkController.updateLinkViewedStatus);

  app.route('/:linkId')
    // Get link info
    .get(linkController.getLinkInfo)
    // Rename link
    .post(linkController.renameLink)
    // Delete link
    .delete(linkController.deleteLink);

};