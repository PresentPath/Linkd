import keyMirror from 'keymirror';

export default {

  ActionTypes: keyMirror({
    RECEIVE_RAW_FOLDERS_FOR_GROUP: null,
    UPDATE_SELECTED_FOLDER_TO_ROOT: null,
    UPDATE_SELECTED_FOLDER: null,
    RECEIVE_RAW_CREATED_FOLDER: null,
    CREATE_FOLDER: null
  })

};