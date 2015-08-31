'use strict';

import React from 'react';
import FolderList from './FolderList';
import LinkList from './LinkList';

let Folder = React.createClass({
  
  render () {
    return (
      <div>
        Folder
        <LinkList/>
      </div>
    );
  }
});

export default Folder;