var Dispatcher = require('../dispatcher/Dispatcher');
var FolderConstants = require('../constants/FolderConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var ActionTypes = FolderConstants.ActionTypes;
var CHANGE_EVENT = 'change';

var _selectedFolderId;
var _selectedGroupId;
var _path = '';

var _folders = {};
// Format:
// { 
//   groupId : {
//     rootFolderId: rootFolderId
//     folderId: folderObj
//   }
// }

var FolderStore = assign({}, EventEmitter.prototype, {
  
  emitChange () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  addRemoveListener (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getFoldersForGroup (groupId) {
    return _folders[groupId];
  }

});

FolderStore.dispatchToken = Dispatcher.register((action) => {

  switch(action.type) {

    case ActionTypes.RECEIVE_RAW_FOLDERS_FOR_GROUP:
      var rawFolders = action.rawFolders;
      var groupId = rawFolders.groupId;
      var groupFolders = _folders[groupId] = {};
      rawFolders.forEach((folder) => {
        // Style attribute used to display only folder with focus
        folder.display = 'none';
        // Add to folders object
        groupFolders[folder.id] = folder;
        if (folder.isRoot) {
          groupFolders.rootFolderId = folder.id;
        }
      });
      FolderStore.emitChange();
      break;

    case ActionTypes.UPDATE_SELECTED_FOLDER:
      var folderId = action.folderId;
      _selectedFolderId = folderId;
      var groupFolders = _folders[_selectedGroupId];
      for (var folderId in groupFolders) {
        groupFolders[folderId].display = 'none';
      }
      // Display folders in hierarchy of selected folder
      var folder = groupFolders[_selectedFolderId];
      while (folder.ParentId !== null) {
        _path = folder.name + '/' + _path;
        // Set isRendered flag to true and make folder visible
        folder.isRendered = true;
        folder.display = 'block';
        folder = groupFolders[folder.ParentId]; 
      }
      FolderStore.emitChange();
      break;

    case ActionTypes.UPDATE_SELECTED_FOLDER_TO_ROOT:
      _selectedGroupId = action.groupId;
      _selectedFolderId = _folders[_selectedGroupId].rootFolderId;
      console.log(_folders[_selectedGroupId])
      var rootFolder = _folders[_selectedGroupId][_selectedFolderId];
      rootFolder.isRendered = true;
      rootFolder.display = 'block';
      FolderStore.emitChange();
      break;

    default:      
      // do nothing
  }

});

module.exports = FolderStore;