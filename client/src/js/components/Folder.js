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

    let contents = folder.isRendered ? (
      <div className="folderContents" style={style}> 
        <FolderList 
          parentFolderId={this.props.key}
          folders={this.props.folders}
          links={this.props.links}
          updateFolder={this.props.updateFolder}
          updateLink={this.props.updateLink} />
        <LinkList/>
      </div>
    ) : undefined;

    return (
      <div className="folder">
        <h4 onClick={this.props.updateFolder.bind(null, folder)}> {folder.name} </h4>
        {contents}
      </div>
    );
  }
});

export default Folder;