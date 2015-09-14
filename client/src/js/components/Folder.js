'use strict';

import FolderActions from '../actions/FolderActions';

import React from 'react';

import FolderList from './FolderList';
import LinkList from './LinkList';

let Folder = React.createClass({

  updateSelectedFolder () {
    FolderActions.updateSelectedFolder(this.props.folder.id);
  },

  render () {

    let folder = this.props.folder;

    let style = {
      display: folder.display
    };

    let iconSource = style.display === 'none' ? 'assets/icons/glyphicons-441-folder-closed.png' : 'assets/icons/glyphicons-145-folder-open.png';

    let contents = folder.isRendered ? (
      <div className="folderContents" style={style}> 
        <FolderList 
          parentFolderId={folder.id} 
          groupId={folder.GroupId} />
        <LinkList
          parentFolderId={folder.id} />
 
      </div>
    ) : undefined;

    return (
      <div className="folder">
        <img className="folderIcon" src={iconSource} />
        <div className="folderName" onClick={this.updateSelectedFolder}> {folder.name} </div>
        {contents}
      </div>
    );
  }
});

export default Folder;