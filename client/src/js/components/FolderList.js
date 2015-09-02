'use strict';

import React from 'react';
import Folder from './Folder';

/*
FolderList
- props:
  - updateFolder
  - updateLink
  - folders
  - links

 */


let FolderList = React.createClass({
  
  render () {

    let childFolders = this.props.folders.filter((folder) => {
      return folder.ParentId === this.props.parentFolderId;
    });

    let folderNodes = childFolders.map((folder) => {
      return (
        <Folder
          key={folder.id}
          folder={folder}
          folders={this.props.folders}
          links={this.props.links}
          updateFolder={this.props.updateFolder}
          updateLink={this.props.updateLink} />
      );
    });

    return (
      <div>
        {folderNodes}
      </div>
    );
  }
});

export default FolderList;