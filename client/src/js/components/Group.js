'use strict';

import React from 'react';
import FolderList from './FolderList';

let Group = React.createClass({
  
  render () {
    return (
      <div>
        Group
        <FolderList/>
      </div>
    );
  }
});

export default Group;