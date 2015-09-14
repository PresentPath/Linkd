var Dispatcher = require('../dispatcher/Dispatcher');
var FolderConstants = require('../constants/FolderConstants');

var ActionTypes = FolderConstants.ActionTypes;

module.exports = {

  receiveFoldersForGroup (rawFolders) {
    Dispatcher.dispatch({
      type: ActionTypes.RECEIVE_RAW_FOLDERS_FOR_GROUP,
      rawFolders: rawFolders
    });
  },

  updateSelectedFolder (folderId) {
    Dispatcher.dispatch({
      type: ActionTypes.UPDATE_SELECTED_FOLDER,
      folderId: folderId
    });
  },

  updateSelectedFolderToRoot (groupId) {
    Dispatcher.dispatch({
      type: ActionTypes.UPDATE_SELECTED_FOLDER_TO_ROOT,
      groupId: groupId
    });
  },

  receiveCreatedFolder (createdFolder) {
    Dispatcher.dispatch({
      type: ActionTypes.RECEIVE_RAW_CREATED_FOLDER,
      rawFolder: createdFolder
    });
  }

};