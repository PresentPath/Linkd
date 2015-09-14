var Dispatcher = require('../dispatcher/Dispatcher');
var GroupConstants = require('../constants/GroupConstants');

var ActionTypes = GroupConstants.ActionTypes;

module.exports = {

  receiveGroups (rawGroups) {
    Dispatcher.dispatch({
      type: ActionTypes.RECEIVE_RAW_GROUPS,
      rawGroups: rawGroups
    })
  },

  updateSelectedGroup (groupId) {
    Dispatcher.dispatch({
      type: ActionTypes.UPDATE_SELECTED_GROUP,
      groupId: groupId
    });
  }

};