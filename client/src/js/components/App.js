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
      curent: {
        user: { user_id_google: '1', name_google: 'testUser1' }, // TODO: get from session
        group: null,
        folder: null,
        path: null,
        link: null, // link object
      },
      groups: [],  
      folders: {},
      links: {},
      comments: {} 
    };
  },
  
  getGroups () {
    return Promise.resolve(
      $.ajax({ url: '/api/group/user/1' })
    )
    .tap((groups) => {
      this.setState({ groups });
    })
    .catch((err) => {
      console.error('Error getting groups list', status, err.toString());
    });
  },

  getFolders () {
    let groups = this.state.groups;
    let groupPromises = groups.map((group) => {
      return Promise.resolve($.ajax({ url: '/api/folder/group/' + group.id }))
        .then((folders) => {
          this.state.folders[group.id] = folders;
          this.setState({ folders: this.state.folders })
        });
    });
    return Promise.all(groupPromises)
    .catch((err) => {
      console.error('Error getting groups list', status, err.toString());
    });
  },

  getLinks () {
    return Promise.resolve(
      $.ajax({ url: '/api/link/user/1' })
    )
    .tap((links) => {
      links.forEach((link) => {
        this.state.links[link.FolderId] = this.state.links[link.FolderId] || [];
        this.state.links[link.FolderId].push(link); 
      });
      this.setState({ links: this.state.links });
    })
    .catch((err) => {
      console.error('Error getting links list', status, err.toString());
    });
  },

  getComments () {
    let groups = this.state.groups;
    let groupPromises = groups.map((group) => {
      return Promise.resolve($.ajax({ url: '/api/comment/group/' + group.id }))
        .then((comments) => {
          this.state.comments[group.id] = {};
          let commentList = this.state.comments[group.id];
          comments.forEach((comment) => {
            commentList[comment.LinkId] = commentList[comment.LinkId] || [];
            // Can we assume comments will be in order? Sorted in terms of primary key and thus time added...
            commentList[comment.LinkId].push(comment);
          });
          this.setState({ comments: this.state.comments })
        });
    });
    return Promise.all(groupPromises)
    .catch((err) => {
      console.error('Error getting comments list', status, err.toString());
    });
  },

  componentDidMount () {
    this.getGroups()
      .then(() => {
        console.log('saved groups list');
        return this.getFolders();
      })
      .then(() => {
        console.log('saved folders list for all groups');
        return this.getLinks();
      })
      .then(() => {
        console.log('saved links list for all folders');
        return this.getComments();
      })
      .then(() => {
        console.log('saved comments list for all links');
      })
      .catch((err) => {
        console.error('Error fetching data', status, err.toString());
      });
  },

  render () {
    return (
      <div>
        App
        <Header/>
        <Toolbar/>
        <GroupList/>
        <LinkDetail/>
      </div>
    );
  }
});

React.render(<App/>, document.body);
