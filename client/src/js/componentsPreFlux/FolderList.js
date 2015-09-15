'use strict';

import React from 'react';
import Folder from './Folder';

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
      <div className="folderList">
        {folderNodes}
      </div>
    );
  }
});

export default FolderList;