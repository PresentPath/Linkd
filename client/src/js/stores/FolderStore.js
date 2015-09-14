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

  getSubfolders (parentFolderInfo) {
    var groupId = parentFolderInfo.groupId;
    var groupFolders = _folders[groupId];
    var parentFolderId = parentFolderInfo.parentFolderId || groupFolders.rootFolderId;
    var subfolders = [];
    for (var folderId in groupFolders) {
      if (groupFolders[folderId].ParentId === parentFolderId) {
        subfolders.push(groupFolders[folderId]);
      }
    }
    return subfolders;
  },

  getRootFolderId (groupId) {
    console.log('groupId', groupId)
    console.log('groupFolders', _folders)
    return _folders[groupId].rootFolderId;
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
        if (groupFolders[folderId].constructor === Object) groupFolders[folderId].display = 'none';
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
      var groupFolders = _folders[_selectedGroupId];
      _selectedFolderId = groupFolders.rootFolderId;
      var rootFolder = groupFolders[_selectedFolderId];
      _path = rootFolder.name + '/';
      rootFolder.isRendered = true;
      rootFolder.display = 'block';
      FolderStore.emitChange();
      break;

    case ActionTypes.RECEIVE_RAW_CREATED_FOLDER:
      var folder = action.rawFolder;
      _selectedGroupId = folder.GroupId;
      _selectedFolderId = folder.id;
      _folders[_selectedGroupId] = _folders[_selectedGroupId] || {};
      var groupFolders = _folders[_selectedGroupId];
      groupFolders[_selectedFolderId] = folder;

      // Display folders in hierarchy of selected folder
      while (folder.ParentId !== null) {
        _path = folder.name + '/' + _path;
        // Set isRendered flag to true and make folder visible
        folder.isRendered = true;
        folder.display = 'block';
        folder = groupFolders[folder.ParentId]; 
      }

      if (folder.isRoot) groupFolders.rootFolderId = _selectedFolderId;
      FolderStore.emitChange();
      break;

    default:      
      // do nothing
  }

});

module.exports = FolderStore;