var Dispatcher = require('../dispatcher/Dispatcher');
var UserConstants = require('../constants/UserConstants');

var ActionTypes = UserConstants.ActionTypes;

module.exports = {

  receiveUser (rawUser) {
    Dispatcher.dispatch({
      type: ActionTypes.RECEIVE_RAW_USER,
      rawUser: rawUser
    })
  }

};