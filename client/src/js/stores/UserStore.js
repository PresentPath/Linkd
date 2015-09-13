var Dispatcher = require('../dispatcher/Dispatcher');
var UserConstants = require('../constants/UserConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var ActionTypes = UserConstants.ActionTypes;
var CHANGE_EVENT = 'change';

// TODO: REMOVE FOR PRODUCTION
var _user = { 
  user_id_google: '1', 
  name_google: 'testUser1' 
};

var UserStore = assign({}, EventEmitter.prototype, {
  
  emitChange () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  addRemoveListener (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getUser () {
    return _user;
  }

});

UserStore.dispatchToken = Dispatcher.register((action) => {

  switch(action.type) {

    case ActionTypes.RECEIVE_RAW_USER:
      _user = action.rawUser;
      UserStore.emitChange();
      break;

    default:      
      // do nothing
  }

});

module.exports = UserStore;