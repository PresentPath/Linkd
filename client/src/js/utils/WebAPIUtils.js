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
var CommentActions = require('../actions/CommentActions');

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
        this.getGroupsForUser(rawUser.user_id_google);
        this.getLinksForUser(rawUser.user_id_google);
      })
      .fail((err) => {
        console.error('Error getting user info', status, err.toString());
      });
  },

  getGroupsForUser(userId) {
    $.get('/api/group/user/' + userId)
      .done((rawGroups) => {
        GroupActions.receiveGroups(rawGroups);
        rawGroups.forEach((group) => {
          this.getFoldersForGroup(group.id);
          this.getCommentsForGroup(group.id);
        });
      })
      .fail((err) => {
        console.error('Error getting groups list', status, err.toString());
      });
  },

  getFoldersForGroup(groupId) {
    $.get('/api/folder/group/' + groupId)
      .done((rawFolders) => {
        rawFolders.groupId = groupId;
        FolderActions.receiveFoldersForGroup(rawFolders);
      })
      .fail((err) => {
        console.error('Error getting folders', status, err.toString());
      });
  },

  getLinksForUser(userId) {
    $.get('/api/link/user/' + userId)
      .done((rawLinks) => {
        LinkActions.receiveLinks(rawLinks);
      })
      .fail((err) => {
        console.error('Error getting links list', status, err.toString());
      });
  },

  getCommentsForGroup(groupId) {
    $.get('/api/comment/group/' + groupId)
      .done((rawComments) => {
        rawComments.groupId = groupId;
        CommentActions.receiveCommentsForGroup(rawComments);
      })
      .fail((err) => {
        console.error('Error getting comments for group', groupId, status, err.toString());
      });
  }

};