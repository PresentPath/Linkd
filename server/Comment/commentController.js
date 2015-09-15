// Comment Controller
// ------------------
//
// Handle interacting with the Comment data in the database.

var Comment = require('../config/db_models.js').Comment;
var User = require('../config/db_models.js').User;


module.exports.createComment = function(req, res) {

  Comment.create( {
    text: req.body.text,
    UserUserIdGoogle: req.body.userId,
    LinkId: req.body.linkId,
    GroupId: req.body.groupId
  })
  .then(function(comment) {
    console.log('Successfully created comment in database');
    // Get comment object with User object
    return Comment.find( { where: {
      id: comment.id
    }, include: [User] } );
  })
  .then(function(comment) {
    // Send comment object back to client as JSON
    res.json(comment);
  })
  .error(function(err) {
    console.error('Error in creating new comment in database:', err);
    res.status(500).send(err);
  });
};

module.exports.getCommentsForGroup = function(req, res) {

  Comment.findAll( { where: {
    GroupId: req.params.groupId
  }, include: [User] })
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