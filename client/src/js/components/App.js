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
        user: { user_id_google: '1', name_google: 'testUser1' }, // TODO: get from session
        groupId: null,
        folderId: null,
        path: null,
        link: null, // link object
      },
      groups: [],  
      folders: {},
      links: {},
      comments: {} 
    };
  },

  getUser () {
    return Promise.resolve($.ajax({ url: '/api/user/info' }))
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
    return Promise.resolve($.ajax({ url: '/api/group/user/1' }))
    .tap((groups) => {
      this.setState({ groups });
    })
    .catch((err) => {
      console.error('Error getting groups list', status, err.toString());
    });
  },

  getFolders () {
    this.state.groups.forEach((group) => {
      $.get('/api/folder/group/' + group.id)
        .done((folders) => {
          this.state.folders['groupID_' + group.id] = folders;
          this.setState({ folders: this.state.folders });          
        })
        .fail((err) => {
          console.error('Error getting folders for group', group.id, status, err.toString());
        });
    });
  },

  getLinks () {
    $.get('/api/link/user/1')
      .done((links) => {
        links.forEach((link) => {
          this.state.links['folderID_' + link.FolderId] = this.state.links['folderID_' + link.FolderId] || [];
          this.state.links['folderID_' + link.FolderId].push(link); 
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
          this.state.comments['groupID_' + group.id] = {};
          let commentListByLink = this.state.comments['groupID_' + group.id];
          comments.forEach((comment) => {
            commentListByLink['linkID_' + comment.LinkId] = commentListByLink['linkID_' + comment.LinkId] || [];
            // Can we assume comments will be in order? Sorted in terms of primary key and thus time added...
            commentListByLink['linkID_' + comment.LinkId].push(comment);
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
    console.log(groupName);
    console.log(this.state);
  },

  addUserToGroup (userEmail) {
    console.log(userEmail);

  },

  addFolder (folderName) {
    console.log(folderName);

  },

  addLink (linkInfo) {
    let { linkName, linkURL } = linkInfo;
    console.log(linkName, linkURL);
  },

  addComment (comment) {
    console.log(comment);
  },

  updateGroup () {

  },

  updateFolder () {

  },

  updatePath () {

  },

  updateLink () {

  },


  render () {
    return (
      <div>
        App

        <Header user={this.state.current.user} />

        <Toolbar
          currentGroup={this.state.current.groupId}
          currentFolder={this.state.current.folderId}
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

