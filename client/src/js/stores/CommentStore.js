var Dispatcher = require('../dispatcher/Dispatcher');
var CommentConstants = require('../constants/CommentConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var ActionTypes = CommentConstants.ActionTypes;
var CHANGE_EVENT = 'change';

var _comments = {};
// Format:
// { 
//   linkId : [{comment}, {comment}]
// }

var CommentStore = assign({}, EventEmitter.prototype, {
  
  emitChange () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  addRemoveListener (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getCommentsForLink (linkId) {
    return _comments[linkId];
  }

});

CommentStore.dispatchToken = Dispatcher.register((action) => {

  switch(action.type) {

    case ActionTypes.RECEIVE_RAW_COMMENTS_FOR_GROUP:
      var rawComments = action.rawComments;
      rawComments.forEach((comment) => {
        var linkId = comment.LinkId;
        _comments[linkId] = _comments[linkId] || [];
        _comments[linkId].push(comment);
      });
      CommentStore.emitChange();
      break;

    case ActionTypes.RECEIVE_RAW_CREATED_MESSAGE:
      var rawComment = action.rawComment;
      var linkId = rawComment.LinkId;
      _comments[linkId] = _comments[linkId] || [];
      _comments[linkId].push(rawComment);
      CommentStore.emitChange();
      break;

    default:      
      // do nothing
  }

});

module.exports = CommentStore;