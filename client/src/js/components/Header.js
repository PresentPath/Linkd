'use strict';

import React from 'react';
import '../../stylesheets/components/header.scss';

let Header = React.createClass({
  
  render () {
    return (
      <div className="header page-header text-center">
          <h1> Linkd </h1>
          
          <div className="logout">
            <span className="greeting">Welcome, {this.props.user.name_google}</span>
            <a href="/api/user/logout" className="btn btn-default btn-sm">Logout</a>
          </div>

          <h4 className="tagline">Share bookmarks with your friends! </h4>
      </div>
    );
  }
});

export default Header;