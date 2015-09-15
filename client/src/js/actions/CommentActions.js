var Dispatcher = require('../dispatcher/Dispatcher');

var WebAPIUtils = require('../utils/WebAPIUtils');

var CommentConstants = require('../constants/CommentConstants');

var ActionTypes = CommentConstants.ActionTypes;

// module.exports = {

//   receiveCommentsForGroup (rawComments) {
//     Dispatcher.dispatch({
//       type: ActionTypes.RECEIVE_RAW_COMMENTS_FOR_GROUP,
//       rawComments: rawComments
//     });
//   },

//   createCommentForLink (comment) {
//     Dispatcher.dispatch({
//       type: ActionTypes.CREATE_COMMENT_FOR_LINK,
//       comment: comment
//     });
//     WebAPIUtils.createComment(comment);
//   },

//   receiveCreatedComment (createdComment) {
//     Dispatcher.dispatch({
//       type: ActionTypes.RECEIVE_RAW_CREATED_MESSAGE,
//       rawComment: createdComment
//     });
//   }

// };


module.exports.receiveCommentsForGroup = function (rawComments) {
  Dispatcher.dispatch({
    type: ActionTypes.RECEIVE_RAW_COMMENTS_FOR_GROUP,
    rawComments: rawComments
  });
};

module.exports.createCommentForLink = function (comment) {
  Dispatcher.dispatch({
    type: ActionTypes.CREATE_COMMENT_FOR_LINK,
    comment: comment
  });
  WebAPIUtils.createComment(comment);
};

module.exports.receiveCreatedComment = function (createdComment) {
  Dispatcher.dispatch({
    type: ActionTypes.RECEIVE_RAW_CREATED_MESSAGE,
    rawComment: createdComment
  });
};


