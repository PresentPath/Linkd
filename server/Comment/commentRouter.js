// Comment Router
// -----------
//
// This router further routes any requests sent to the /api/comment path.
// The Comment controller exposes methods for interacting with the Comment data in the database.

var commentController = require('./commentController.js');

module.exports = function(app) {

  // Add comments
  app.route('/create')
    .post(commentController.createComment);

  // Get comments for a link
  app.route('/group/:groupId')
    .get(commentController.getCommentsForGroup);

};