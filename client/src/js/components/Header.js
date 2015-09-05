'use strict';

import React from 'react';
import '../../stylesheets/components/header.scss';

let Header = React.createClass({
  
  render () {
    return (
      <div className="header page-header text-center">
          <h1> Welcome to Linkd! </h1>
          Hello {this.props.user.name_google}! Share bookmarks with your friends! <br/>
          <a href="/api/user/logout" className="btn btn-default btn-sm">Logout</a>
      </div>
    );
  }
});

export default Header;