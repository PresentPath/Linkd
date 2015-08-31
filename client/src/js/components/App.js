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
      $.ajax({
        url: '/api/group/user/1'
      })
    )
    .tap((groups) => {
      this.setState({ groups });
    })
    .catch((err) => {
      console.error('Error getting groups list', status, err.toString());
    });
  },

  getFolders (groups) {
    var groupPromises = groups.map((group) => {
      return Promise.resolve($.ajax({
          url: '/api/folder/group/' + group.id
        }))
        .then((folders) => {
          console.log('folders list for group', group.id);
          this.state.folders[group.id] = folders;
          this.setState({ folders: this.state.folders })
          console.log('state folders', this.state.folders);
        });
    })
    return Promise.all(groupPromises)
    .catch((err) => {
      console.error('Error getting groups list', status, err.toString());
    });
  },

  componentDidMount () {
    console.log('make request for groups');
    this.getGroups()
      .then((groups) => {
        console.log('saved groups list', groups);
        return this.getFolders(groups);
      })
      .then(() => {
        console.log('saved folders list for all groups');
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
