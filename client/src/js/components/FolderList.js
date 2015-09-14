'use strict';

import React from 'react';
import Folder from './Folder';

import FolderStore from '../stores/FolderStore';

function getStateFromStores(parentFolderInfo) {
  return {
    folders: FolderStore.getSubfolders(parentFolderInfo)
  };
};

function getFolderListItem(folder) {
  // return (
  //   <p> {folder.id} </p>
  // );
  return (
    <Folder 
      key={folder.id}
      folder={folder} />
  );
};

let FolderList = React.createClass({

  getInitialState () {
    return getStateFromStores({
      groupId: this.props.groupId,
      parentFolderId: this.props.parentFolderId
    });
  },

  componentDidMount () {
    FolderStore.addChangeListener(this._onChange);
  },

  componentWillUnmount () {
    FolderStore.removeChangeListener(this._onChange);
  },

  render () {

    let folders = this.state.folders;

    let folderListItems = Object.keys(folders).map((folderId) => {
        return getFolderListItem(folders[folderId]);
      });

    return (
      <div className="folderList">
        {folderListItems}
      </div>
    );
  },

  _onChange () {
    this.setState(getStateFromStores({
      groupId: this.props.groupId,
      parentFolderId: this.props.parentFolderId
    }));
  }

});

export default FolderList;