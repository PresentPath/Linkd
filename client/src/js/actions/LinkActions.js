var Dispatcher = require('../dispatcher/Dispatcher');
var LinkConstants = require('../constants/LinkConstants');

var ActionTypes = LinkConstants.ActionTypes;

module.exports = {

  receiveLinks (rawLinks) {
    Dispatcher.dispatch({
      type: ActionTypes.RECEIVE_RAW_LINKS,
      rawLinks: rawLinks
    })
  },

  updateSelectedLink (link) {
    Dispatcher.dispatch({
      type: ActionTypes.UPDATE_SELECTED_LINK,
      link: link
    });
  }

};