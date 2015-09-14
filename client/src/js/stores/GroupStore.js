var Dispatcher = require('../dispatcher/Dispatcher');
var GroupConstants = require('../constants/GroupConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var UserStore = require('./UserStore');

var FolderActions = require('../actions/FolderActions');

var ActionTypes = GroupConstants.ActionTypes;
var CHANGE_EVENT = 'change';

var _selectedGroupId;

var _groups = {};

var GroupStore = assign({}, EventEmitter.prototype, {
  
  emitChange () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  addRemoveListener (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getGroups () {
    return _groups;
  },

  getSelectedGroupId () {
    return _selectedGroupId;
  }

});

GroupStore.dispatchToken = Dispatcher.register((action) => {

  switch(action.type) {

    case ActionTypes.RECEIVE_RAW_GROUPS:
      Dispatcher.waitFor([UserStore.dispatchToken]);
      var rawGroups = action.rawGroups;
      rawGroups.forEach((group) => {
        // Group contents only loaded once clicked for the first time
        group.isRendered = false;
        // Style attribute used to display only group with focus
        group.display = 'none';
        // Add to groups object
        _groups[group.id] = group;
      });
      GroupStore.emitChange();
      break;

    case ActionTypes.UPDATE_SELECTED_GROUP:
      var groupId = action.groupId;
      _selectedGroupId = groupId;
      _groups[groupId].isRendered = true;
      for (var key_groupId in _groups) {
        _groups[key_groupId].display = 'none';
      }
      _groups[groupId].display = 'block';
      GroupStore.emitChange();
      break;

    default:      
      // do nothing
  }

});

module.exports = GroupStore;