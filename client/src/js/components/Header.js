'use strict';

import React from 'react';

import UserStore from '../stores/UserStore';

import '../../stylesheets/components/header.scss';

function getStateFromStores() {
  return {
    user: UserStore.getUser()
  }
};

let Header = React.createClass({

  getInitialState () {
    return getStateFromStores();
  },

  componentDidMount () {
    UserStore.addChangeListener(this._onChange);
  },

  componentWillUnmount () {
    UserStore.removeChangeListener(this._onChange);
  },
  
  render () {
    return (
      <div className="header page-header text-center">
          <h1> &lt;&gt; Linkd </h1>
          
          <div className="logout">
            <span className="greeting">Welcome, {this.state.user.name_google}</span>
            <a href="/api/user/logout" className="logoutButton btn btn-default btn-sm">Logout</a>
          </div>

          <h4 className="tagline">Share bookmarks with your friends! </h4>
      </div>
    );
  },

  _onChange () {
    this.setState(getStateFromStores());
  }

});

export default Header;