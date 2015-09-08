'use strict';

import $ from 'jquery';
import Promise from 'bluebird';

import React from 'react';
import Header from './Header';
import Toolbar from './Toolbar';
import GroupList from './GroupList';
import LinkDetail from './LinkDetail';

import '../../stylesheets/components/app.scss';

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
      this.state.current.user = user;
      this.setState({ current: this.state.current });
    })
    .catch((err) => {
      console.error('Error getting user info', status, err.toString());
    });
  },
  
  getGroups () {
    return Promise.resolve($.get('/api/group/user/' + this.state.current.user.user_id_google))
    .tap((groups) => {
      groups.forEach((group) => {
        // Group contents only loaded once clicked for the first time
        group.isRendered = false;
        // Style attribute used to display only group with focus
        group.display = 'none';
        // Initialize the comments for the group to an empty object
        // to be populated when we get the comments data
        this.state.comments['groupId_' + group.id] = {};
      });
      this.setState({ groups, comments: this.state.comments });
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
            folder.display = 'none';
          });
          this.state.folders['groupId_' + group.id] = folders;
          this.setState({ folders: this.state.folders });
        });
    })
    .catch((err) => {
      console.error('Error getting folders', status, err.toString());
    });
  },

  getGroupForLink (link) {
    let groupId;
    this.state.groups.some((group) => {
      return this.state.folders['groupId_' + group.id].some((folder) => {
        if (folder.id === link.FolderId) {
          return groupId = group.id;
        }
      });
    });
    return groupId;
  },

  getLinks () {
    return Promise.resolve($.get('/api/link/user/' + this.state.current.user.user_id_google))
      .then((links) => {
        this.state.links = {};
        links.forEach((link) => {
          let folder = 'folderId_' + link.FolderId;
          // Store the links by the folder that they belong to
          this.state.links[folder] = this.state.links[folder] || [];
          this.state.links[folder].push(link);
          // Initialize the comments for the link to an empty array
          // to be populated when we get the comments data
          this.state.comments['groupId_' + this.getGroupForLink(link)]['linkId_' + link.id] = [];
        });
        this.setState({ links: this.state.links, comments: this.state.comments });
      })
      .catch((err) => {
        console.error('Error getting links list', status, err.toString());
      });
  },

  getComments () {
    this.state.groups.forEach((group) => {
      $.get('/api/comment/group/' + group.id)
        .done((comments) => {
          let commentListByLink = this.state.comments['groupId_' + group.id];
          comments.forEach((comment) => {
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
    // Retrieve initial data
    this.getUser()
      .then(() => {
        return this.getGroups();
      })
      .then(() => {
        return this.getFolders();
      })
      .then(() => {
        return this.getLinks();
      })
      .then(() => {
        this.getComments();
      })
      .catch((err) => {
        console.error('Error in initializing data', status, err.toString());
      });
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
        let groupReference = this.state.groups.filter((currentGroup) => {
          return currentGroup.id === group.id;
        })[0];
        this.updateGroup(groupReference);
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
      $.post('/api/folder/create', 
        { 
          name: folderName, 
          groupId: groupId,
          parentId: folderId
        })
        .done((folder) => {
          this.getFolders()
            .then(() => {
              this.updateFolder(folder);
            });
        })
        .fail((err) => {
          console.error('Error creating folder', status, err.toString());
        });
    }
  },

  addLink (linkInfo) {
    let { linkName, linkURL } = linkInfo;
    let folderId = this.state.current.folder.id;
    this.state.comments['groupId_' + this.state.current.group.id] = this.state.comments['groupId_' + this.state.current.group.id] || {};
    if (folderId) {
      this.state.links['folderId_' + folderId] = this.state.links['folderId_' + folderId] || [];
      $.post('/api/link/create', 
        { 
          name: linkName, 
          url: linkURL,
          folderId: folderId
        })
        .done((link) => {
          this.state.comments['groupId_' + this.state.current.group.id]['linkId_' + link.id] = [];
          this.updateLink(link);
          this.getLinks();
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
      this.state.comments['groupId_' + groupId]['linkId_' + linkId] = this.state.comments['groupId_' + groupId]['linkId_' + linkId];
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
    // Set isRendered flag to true and make group visible
    selectedGroup.isRendered = true;
    // Hide all groups except for selected group
    this.state.groups.forEach((group) => {
      group.display = 'none';
    });
    selectedGroup.display = 'block';
    this.state.current.group = selectedGroup;
    let folder = this.state.folders['groupId_' + selectedGroup.id].filter((folder) => {
      return folder.isRoot;
    })[0];
    this.updateFolder(folder);
    // Trigger re-render
    this.setState({ current: this.state.current, groups: this.state.groups });
  },

  updateFolder (targetFolder) {

    let folders = this.state.folders['groupId_' + targetFolder.GroupId];

    let selectedFolder = folders.filter((folder) => {
      return folder.id === targetFolder.id;
    })[0];

    // Hide all folders except for selected folder
    folders.forEach((folder) => {
      folder.display = 'none';
    });
    let folder = selectedFolder;

    let path = '';
    // Display folders in hierarchy of selected folder
    while (folder.ParentId !== null) {
      path = folder.name + '/' + path;
      // Set isRendered flag to true and make folder visible
      folder.isRendered = true;
      folder.display = 'block';
      folder = folders.filter((folderInstance) => {
        return folderInstance.id == folder.ParentId;
      })[0];
    }

    this.state.current.path = folder.name + '/' + path;
    // Set current folder
    this.state.current.folder = selectedFolder;
    // Clear out current link
    this.state.current.link = {};
    // Trigger re-render
    this.setState({ current: this.state.current, folders: this.state.folders });
  },

  updateLink (link) {
    this.state.current.link = link;
    this.setState({ current: this.state.current });
  },

  render () {

    let groupId = this.state.current.group.id;
    let linkId = this.state.current.link.id;
    let comments;

    // If a group and link have been selected at the time of rendering
    if (groupId && linkId) {
      // if comments exist for the link then use them, otherwise use an empty array for the comments
      comments = this.state.comments['groupId_' + groupId]['linkId_' + linkId] ? this.state.comments['groupId_' + groupId]['linkId_' + linkId] : [];
    } else {
      // if a group and link have not been selected at the time of rendering
      // then use an empty array for the comments
      comments = [];
    }

    let linkDetail = groupId && linkId ? (
      <LinkDetail
        LinkDetail
        currentLink={this.state.current.link}
        comments={comments}
        addComment={this.addComment} />
    ) : undefined;

    return (
      <div className="app">

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

