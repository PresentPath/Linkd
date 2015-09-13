// Web API Utilities
// ---------------
//
// Handle requests to the server.

'use strict';

import $ from 'jquery';
import Promise from 'bluebird';

var UserActions = require('../actions/UserActions');
var GroupActions = require('../actions/GroupActions');

module.exports = {

  getUser () {
    $.get('/api/user/info')
      .done((rawUser) => {
        // If in a production environment then set the user
        // to the authenticated user
        // Otherwise use the mock user for development
        var rawUser;
        if (rawUser.productionEnvironment) {
          rawUser = rawUser;
        } else {
          rawUser = { 
            user_id_google: '1', 
            name_google: 'testUser1' 
          };
        }
        UserActions.receiveUser(rawUser);
        this.getGroups(rawUser.user_id_google);
      })
      .fail((err) => {
        console.error('Error getting user info', status, err.toString());
      });
  },

  getGroups(userId) {
    $.get('/api/group/user/' + userId)
      .done((rawGroups) => {
        GroupActions.receiveGroups(rawGroups);
      })
      .fail((err) => {
        console.error('Error getting groups list', status, err.toString());
      });
  }

};