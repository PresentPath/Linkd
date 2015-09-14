// Web API Utilities
// ---------------
//
// Handle requests to the server.

'use strict';

import $ from 'jquery';
import Promise from 'bluebird';

var UserActions = require('../actions/UserActions');
var GroupActions = require('../actions/GroupActions');
var FolderActions = require('../actions/FolderActions');
var LinkActions = require('../actions/LinkActions');

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
        this.getLinks(rawUser.user_id_google);
      })
      .fail((err) => {
        console.error('Error getting user info', status, err.toString());
      });
  },

  getGroups(userId) {
    $.get('/api/group/user/' + userId)
      .done((rawGroups) => {
        GroupActions.receiveGroups(rawGroups);
        rawGroups.forEach((group) => {
          this.getFolders(group.id);
        });
      })
      .fail((err) => {
        console.error('Error getting groups list', status, err.toString());
      });
  },

  getFolders(groupId) {
    $.get('/api/folder/group/' + groupId)
      .done((rawFolders) => {
        rawFolders.groupId = groupId;
        FolderActions.receiveFoldersForGroup(rawFolders);
      })
      .fail((err) => {
        console.error('Error getting folders', status, err.toString());
      });
  },

  getLinks(userId) {
    $.get('/api/link/user/' + userId)
      .done((rawLinks) => {
        LinkActions.receiveLinks(rawLinks);
      })
      .fail((err) => {
        console.error('Error getting links list', status, err.toString());
      });
  }

};