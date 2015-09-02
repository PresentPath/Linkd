'use strict';

import $ from 'jquery';
import Promise from 'bluebird';

import React from 'react';
import Header from './Header';
import Toolbar from './Toolbar';
import GroupList from './GroupList';
import LinkDetail from './LinkDetail';


let App = React.createClass({
  
  getInitialState () {
    return {
      current: {
        user: { user_id_google: '1', name_google: 'testUser1' }, 
        group: {},
        folder: {},
        path: '/',
        link: {} 
      },
      groups: [],  
      folders: {},
      links: {},
      comments: {} 
    };
  },

  getUser () {
    return Promise.resolve($.get('/api/user/info'))
    .tap((user) => {
      // TODO: Add logic to check if in production
      // this.state.current.user = user;
      // this.setState({ current: this.state.current });
    })
    .catch((err) => {
      console.error('Error getting user info', status, err.toString());
    });
  },
  
  getGroups () {
    return Promise.resolve($.get('/api/group/user/1'))
    .tap((groups) => {
      // TODO: For testing only!!!
      groups = groups.map((group) => {
        // Group contents only loaded once clicked for the first time
        group.isRendered = false;
        // Style attribute used to display only group with focus
        group.visibility = 'hidden';
        return group;
      });
      this.state.current.group = groups[0];
      this.setState({ groups, current: this.state.current });
      console.log(this.state);
    })
    .catch((err) => {
      console.error('Error getting groups list', status, err.toString());
    });
  },

  getFolders () {
    this.state.groups.forEach((group) => {
      $.get('/api/folder/group/' + group.id)
        .done((folders) => {
          // TODO: For testing only!!!
          this.state.current.folder = folders[0];      
          this.state.folders['groupId_' + group.id] = folders;
          this.setState({ folders: this.state.folders, current: this.state.current });
        })
        .fail((err) => {
          console.error('Error getting folders for group', group.id, status, err.toString());
        });
    });
  },

  getLinks () {
    $.get('/api/link/user/1')
      .done((links) => {
        // TODO: For testing only!!!
        this.state.current.link = links[0];  
        links.forEach((link) => {
          this.state.links['folderId_' + link.FolderId] = this.state.links['folderId_' + link.FolderId] || [];
          this.state.links['folderId_' + link.FolderId].push(link); 
        });
        this.setState({ links: this.state.links, current: this.state.current });
      })
      .fail((err) => {
        console.error('Error getting links list', status, err.toString());
      });
  },

  getComments () {
    this.state.groups.forEach((group) => {
      $.get('/api/comment/group/' + group.id)
        .done((comments) => {
          this.state.comments['groupId_' + group.id] = {};
          let commentListByLink = this.state.comments['groupId_' + group.id];
          comments.forEach((comment) => {
            commentListByLink['linkId_' + comment.LinkId] = commentListByLink['linkId_' + comment.LinkId] || [];
            // Can we assume comments will be in order? Sorted in terms of primary key and thus time added...
            commentListByLink['linkId_' + comment.LinkId].push(comment);
          });
          this.setState({ comments: this.state.comments });          
        })
        .fail((err) => {
          console.error('Error getting comments for group', group.id, status, err.toString());
        });
    });
  },

  componentDidMount () {
    // Get groups then get folders and comments for group
    this.getUser()
      .then(() => {
        return this.getGroups();
      })
      .then(() => {
        this.getFolders();
        this.getComments();
      });

      // get link for user
      this.getLinks();
  },

  addGroup (groupName) {
    $.post('/api/group/create', { name: groupName, userId: this.state.current.user.user_id_google })
      .done((group) => {
        this.state.groups.push(group);
        this.setState({ groups: this.state.groups });  
      })
      .fail((err) => {
        console.error('Error creating group', group.id, status, err.toString());
      });
  },

  addUserToGroup (userEmail) {
    let groupId = this.state.current.group.id;
    if (groupId) {
      $.post('/api/group/addUser', { email: userEmail, groupId: groupId })
        .done((users) => {
          this.state.groups.filter(function(group) {
            return group.id === groupId;
          })[0].Users = users;
          this.setState({ groups: this.state.groups });  
        })
        .fail((err) => {
          console.error('Error creating group', group.id, status, err.toString());
        });
    }

  },

  addFolder (folderName) {
    let groupId = this.state.current.group.id;
    if (groupId) {
      let folderId = this.state.current.folder.id;
      this.state.folders['groupId_' + groupId] = this.state.folders['groupId_' + groupId] || [];
      let folders = this.state.folders['groupId_' + groupId];
      $.post('/api/folder/create', 
        { 
          name: folderName, 
          groupId: groupId,
          parentId: folderId
        })
        .done((folder) => {
          folders.push(folder);
          this.state.current.folder = folder;
          this.setState({ folders: this.state.folders, current: this.state.current }); 
        })
        .fail((err) => {
          console.error('Error creating folder', status, err.toString());
        });
    }
  },

  addLink (linkInfo) {
    let { linkName, linkURL } = linkInfo;
    let folderId = this.state.current.folder.id;
    if (folderId) {
      this.state.links['folderId_' + folderId] = this.state.links['folderId_' + folderId] || [];
      let links = this.state.links['folderId_' + folderId];
      $.post('/api/link/create', 
        { 
          name: linkName, 
          url: linkURL,
          folderId: folderId
        })
        .done((link) => {
          links.push(link);
          this.state.current.link = link;
          this.setState({ links: this.state.links, current: this.state.current }); 
        })
        .fail((err) => {
          console.error('Error creating link', status, err.toString());
        });
    }
  },

  addComment (text) {
    let linkId = this.state.current.link.id;
    let groupId = this.state.current.group.id;
    if (linkId) {
      let userId = this.state.current.user.user_id_google;
      this.state.comments['groupId_' + groupId] = this.state.comments['groupId_' + groupId] || {};
      this.state.comments['groupId_' + groupId]['linkId_' + linkId] = this.state.comments['groupId_' + groupId]['linkId_' + linkId] || [];
      let comments = this.state.comments['groupId_' + groupId]['linkId_' + linkId];
      $.post('/api/comment/create', 
        { 
          text, 
          userId,
          linkId
        })
        .done((comment) => {
          comments.push(comment);
          this.setState({ comments: this.state.comments }); 
        })
        .fail((err) => {
          console.error('Error creating comment', status, err.toString());
        });
    }
  },

  updateGroup (selectedGroup) {
    console.log('update group');
    // Set isRendered flag to true and make group visible
    selectedGroup.isRendered = true;
    // Hide all groups except fpr selected group
    this.state.groups.forEach((group) => {
      group.display = 'none';
    });
    selectedGroup.display = 'block';
    // Set current group
    this.state.current.group = selectedGroup;
    // Trigger re-render
    this.setState({ current: this.state.current });
  },

  updateFolder () {
    console.log('update folder');
  },

  updatePath () {
    console.log('update path');
  },

  updateLink () {
    console.log('update link');
  },


  render () {
    return (
      <div className="app">
        App

        <Header user={this.state.current.user} />

        <Toolbar
          currentGroup={this.state.current.group.name}
          currentPath={this.state.current.path}
          addGroup={this.addGroup}
          addUserToGroup={this.addUserToGroup}
          addFolder={this.addFolder}
          addLink={this.addLink} />

        <GroupList
          groups={this.state.groups}
          folders={this.state.folders}
          links={this.state.links}
          updateGroup={this.updateGroup}
          updateFolder={this.updateFolder}
          updateLink={this.updateLink} />

        <LinkDetail
          currentLink={this.state.current.link}
          comments={this.state.current.comments}
          addComment={this.addComment} />

      </div>
    );
  }
});

React.render(<App/>, document.getElementById('main'));

