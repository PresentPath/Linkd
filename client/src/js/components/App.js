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
      groups.forEach((group) => {
        // Group contents only loaded once clicked for the first time
        group.isRendered = false;
        // Style attribute used to display only group with focus
        group.display = 'none';
      });
      this.setState({ groups });
      console.log(this.state);
    })
    .catch((err) => {
      console.error('Error getting groups list', status, err.toString());
    });
  },

  getFolders () {
    return Promise.map(this.state.groups, (group) => {
      return Promise.resolve($.get('/api/folder/group/' + group.id))
        .then((folders) => {
          folders.forEach((folder) => {
            folder.isRendered = false;
            folder.display = 'none';
          });
          this.state.folders['groupId_' + group.id] = folders;
          this.setState({ folders: this.state.folders });
          console.log('getFolders', this.state.folders);
        });
    })
    .then(() => {
      console.log('get folders complete');
    })
    .catch((err) => {
      console.error('Error getting folders', status, err.toString());
    });
  },

  getLinks () {
    $.get('/api/link/user/1')
      .done((links) => {
        links.forEach((link) => {
          this.state.links['folderId_' + link.FolderId] = this.state.links['folderId_' + link.FolderId] || [];
          this.state.links['folderId_' + link.FolderId].push(link); 
        });
        this.setState({ links: this.state.links });
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
    let group;
    return Promise.resolve($.post('/api/group/create', { name: groupName, userId: this.state.current.user.user_id_google }))
      .then((response) => {
        group = response[0];
        return this.getGroups();
      })
      .then(() => {
        return this.getFolders();
      })
      .then(() => {
        this.updateGroup(group);
        console.log(this.state);
      })
      .catch((err) => {
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
      let folders = this.state.folders['groupId_' + groupId];
      $.post('/api/folder/create', 
        { 
          name: folderName, 
          groupId: groupId,
          parentId: folderId
        })
        .done((folder) => {
          console.log(folder);
          console.log(this.state.folders);
          // folders.push(folder);
          this.state.current.folder = folder;
          this.setState({ current: this.state.current }); 
          this.getFolders();
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
      console.log(this.state.current.user);
      let userId = this.state.current.user.user_id_google;
      this.state.comments['groupId_' + groupId] = this.state.comments['groupId_' + groupId] || {};
      this.state.comments['groupId_' + groupId]['linkId_' + linkId] = this.state.comments['groupId_' + groupId]['linkId_' + linkId] || [];
      let comments = this.state.comments['groupId_' + groupId]['linkId_' + linkId];
      $.post('/api/comment/create', 
        { 
          text, 
          userId,
          linkId,
          groupId
        })
        .done((comment) => {
          comment.User = this.state.current.user;
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
    this.state.current.group = selectedGroup;
    console.log('folders', this.state.folders);
    let folder = this.state.folders['groupId_' + selectedGroup.id].filter((folder) => {
      return folder.isRoot;
    })[0];
    this.updateFolder(folder);
    // Trigger re-render
    this.setState({ current: this.state.current });
  },

  updateFolder (selectedFolder) {
    console.log('update folder');
    // Set isRendered flag to true and make folder visible
    selectedFolder.isRendered = true;
    // Hide all folders except for selected folder
    this.state.folders['groupId_' + selectedFolder.GroupId].forEach((folder) => {
      folder.display = 'none';
    });
    let folder = selectedFolder;

    let path = '';
    // Display folders in hierarchy of selected folder
    while (folder.ParentId !== null) {
      path = folder.name + '/' + path;
      console.log(path);
      folder.display = 'block';
      folder = this.state.folders['groupId_' + folder.GroupId].filter((folderInstance) => {
        return folderInstance.id === folder.ParentId;
      })[0] || {};
    }

    this.state.current.path = folder.name + '/' + path;
    // Set current folder
    this.state.current.folder = selectedFolder;
    // Trigger re-render
    this.setState({ current: this.state.current, folders: this.state.folders });
  },

  updateLink (link) {
    console.log('update link');
    this.state.current.link = link;

    this.setState({ current: this.state.current });
  },

  render () {

    let groupId = this.state.current.group.id;
    let linkId = this.state.current.link.id;

    let linkDetail = linkId ? (
      <LinkDetail
        LinkDetail
        currentLink={this.state.current.link}
        comments={this.state.comments['groupId_' + groupId]['linkId_' + linkId] || []}
        addComment={this.addComment} />
    ) : undefined;

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

          {linkDetail}

      </div>
    );
  }
});

React.render(<App/>, document.getElementById('main'));

