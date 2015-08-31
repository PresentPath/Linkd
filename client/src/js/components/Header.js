'use strict';

import React from 'react';

let Header = React.createClass({
  
  render () {
    return (
      <div class="page-header text-center">
          <h1><span class="fa fa-anchor">Hello</span> Welcome to Linkd! </h1>
          <a href="/api/user/logout" class="btn btn-default btn-sm">Logout</a>
      </div>
    );
  }
});

export default Header;