'use strict';

import React from 'react';
import FolderList from './FolderList';
import LinkList from './LinkList';

let Folder = React.createClass({

  render () {

    let folder = this.props.folder;

    let style = {
      display: folder.display
    };

    let iconSource = style.display === 'none' ? 'assets/icons/glyphicons-441-folder-closed.png' : 'assets/icons/glyphicons-145-folder-open.png';

    let contents = folder.isRendered ? (
      <div className="folderContents" style={style}> 
        <FolderList 
          parentFolderId={this.props.folder.id}
          folders={this.props.folders}
          links={this.props.links}
          updateFolder={this.props.updateFolder}
          updateLink={this.props.updateLink} />
        <LinkList
          folderId={folder.id}
          links={this.props.links} 
          updateLink={this.props.updateLink} />
      </div>
    ) : undefined;

    return (
      <div className="folder">
        <img className="folderIcon" src={iconSource} />
        <div className="folderName" onClick={this.props.updateFolder.bind(null, folder)}> {folder.name} </div>
        {contents}
      </div>
    );
  }
});

export default Folder;