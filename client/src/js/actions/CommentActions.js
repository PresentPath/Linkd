var Dispatcher = require('../dispatcher/Dispatcher');
var CommentConstants = require('../constants/CommentConstants');

var ActionTypes = CommentConstants.ActionTypes;

module.exports = {

  receiveCommentsForGroup (rawComments) {
    Dispatcher.dispatch({
      type: ActionTypes.RECEIVE_RAW_COMMENTS_FOR_GROUP,
      rawComments: rawComments
    });
  }

};