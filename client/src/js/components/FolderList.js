'use strict';

import React from 'react';
import Folder from './Folder';

let FolderList = React.createClass({
  
  render () {
    return (
      <div>
        FolderList
        <Folder/>
      </div>
    );
  }
});

export default FolderList;