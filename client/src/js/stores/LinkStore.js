var Dispatcher = require('../dispatcher/Dispatcher');
var LinkConstants = require('../constants/LinkConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var FolderActions = require('../actions/FolderActions');

var ActionTypes = LinkConstants.ActionTypes;
var CHANGE_EVENT = 'change';

var _selectedLink;

var _links = {};
// Format: {
//  folderId: [{link}, {link}]
// }

var LinkStore = assign({}, EventEmitter.prototype, {
  
  emitChange () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  addRemoveListener (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getLinksForFolder (folderId) {
    return _links[folderId];
  },

  getSelectedLink () {
    return _selectedLink;
  }

});

LinkStore.dispatchToken = Dispatcher.register((action) => {

  switch(action.type) {

    case ActionTypes.RECEIVE_RAW_LINKS:
      var rawLinks = action.rawLinks;
      rawLinks.forEach((link) => {
        _links[link.FolderId] = _links[link.FolderId] || [];
        _links[link.FolderId].push(link);
      });
      LinkStore.emitChange();
      break;

    case ActionTypes.UPDATE_SELECTED_LINK:
      _selectedLink = action.link;
      LinkStore.emitChange();
      break;

    default:      
      // do nothing
  }

});

module.exports = LinkStore;