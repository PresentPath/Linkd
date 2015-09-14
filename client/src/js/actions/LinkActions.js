var Dispatcher = require('../dispatcher/Dispatcher');
var LinkConstants = require('../constants/LinkConstants');

var WebAPIUtils = require('../utils/WebAPIUtils');


var ActionTypes = LinkConstants.ActionTypes;

module.exports = {

  receiveLinks (rawLinks) {
    Dispatcher.dispatch({
      type: ActionTypes.RECEIVE_RAW_LINKS,
      rawLinks: rawLinks
    });
  },

  updateSelectedLink (link) {
    Dispatcher.dispatch({
      type: ActionTypes.UPDATE_SELECTED_LINK,
      link: link
    });
  },

  createLink (link) {
    Dispatcher.dispatch({
      type: ActionTypes.CREATE_LINK,
      link: link
    });
    WebAPIUtils.createLink(link);
  },

  receiveCreatedLink (rawLink) {
    Dispatcher.dispatch({
      type: ActionTypes.RECEIVE_CREATED_LINK,
      rawLink: rawLink
    });
  }

};