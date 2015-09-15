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


module.exports.getUser = function() {
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
};

module.exports.getGroupsForUser = function(userId) {
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
};

module.exports.getFoldersForGroup = function(groupId) {
  $.get('/api/folder/group/' + groupId)
    .done((rawFolders) => {
      rawFolders.groupId = groupId;
      FolderActions.receiveFoldersForGroup(rawFolders);
    })
    .fail((err) => {
      console.error('Error getting folders', status, err.toString());
    });
};

module.exports.getLinksForUser = function(userId) {
  $.get('/api/link/user/' + userId)
    .done((rawLinks) => {
      LinkActions.receiveLinks(rawLinks);
    })
    .fail((err) => {
      console.error('Error getting links list', status, err.toString());
    });
};

module.exports.getCommentsForGroup = function(groupId) {
  $.get('/api/comment/group/' + groupId)
    .done((rawComments) => {
      rawComments.groupId = groupId;
      CommentActions.receiveCommentsForGroup(rawComments);
    })
    .fail((err) => {
      console.error('Error getting comments for group', groupId, status, err.toString());
    });
};

module.exports.createComment = function(comment) {
  $.post('/api/comment/create', comment)
    .done((rawComment) => {
      CommentActions.receiveCreatedComment(rawComment);
    })
    .fail((err) => {
      console.error('Error creating comment', status, err.toString());
    });
};

module.exports.createGroup = function(group) {
  $.post('/api/group/create', group)
    .done((response) => {
      var rawGroup = response[0];
      var rawFolder = response[1];
      GroupActions.receiveCreatedGroup(rawGroup);
      FolderActions.receiveCreatedFolder(rawFolder);
      GroupActions.updateSelectedGroup(rawGroup.id);
      FolderActions.updateSelectedFolderToRoot(rawGroup.id);
    })
    .fail((err) => {
      console.error('Error creating group', group.id, status, err.toString());
    });
};

module.exports.addUserToGroup = function(user) {
  $.post('/api/group/addUser', user)
    .done((groupMembers) => {
      groupMembers.groupId = user.groupId;
      GroupActions.receiveGroupMembers(groupMembers);
    })
    .fail((err) => {
      console.error('Error creating adding user to group', user.email, status, err.toString());
    });
};

module.exports.createFolder = function(folder) {
  $.post('/api/folder/create', folder)
    .done((rawFolder) => {
      console.log('folder fromd atabase',rawFolder);
      FolderActions.receiveCreatedFolder(rawFolder);
      FolderActions.updateSelectedFolder(rawFolder.id);
    })
    .fail((err) => {
      console.error('Error creating folder', status, err.toString());
    });
};

module.exports.createLink = function(link) {
  $.post('/api/link/create', link)
    .done((link) => {
      LinkActions.receiveCreatedLink(link);
      LinkActions.updateSelectedLink(link);
    })
    .fail((err) => {
      console.error('Error creating link', status, err.toString());
    });
};
