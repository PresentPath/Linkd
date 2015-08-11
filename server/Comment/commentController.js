// Comment Controller
// ------------------
//
// Handle interacting with the Comment data in the database.

var Comment = require('../config/db_models.js').Comment;

module.exports.createComment = function(req, res) {

  Comment.create( {
    text: req.body.text,
    AuthorUserIdGoogle: req.body.userId,
    LinkId: req.body.linkId
  })
  .then(function(comment) {
    console.log('Successfully created comment in database');
    // Send comment object back to client as JSON
    res.json(comment);
  })
  .error(function(err) {
    console.error('Error in creating new comment in database:', err);
    res.status(500).send(err);
  });
};

module.exports.getCommentsForLink = function(req, res) {

  Comment.findAll( { where: {
    LinkId: req.params.linkId
  } })
  .then(function(comments) {
    console.log('Successfully retrieved comments from database');
    // Send comments object back to client as JSON
    res.json(comments);
  })
  .error(function(err) {
    console.error('Error in retrieving comments from database:', err);
    res.status(500).send(err);
  });
};