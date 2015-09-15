'use strict';

import React from 'react';
import Folder from './Folder';

import FolderStore from '../stores/FolderStore';
import FolderForm from './FolderForm';

function getStateFromStores(parentFolderInfo) {
  return {
    folders: FolderStore.getSubfolders(parentFolderInfo),
    selectedFolderId: FolderStore.getSelectedFolderId()
  };
};

function getFolderListItem(folder) {
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
    let groupId = this.props.groupId;
    let parentFolderId = this.props.parentFolderId;

    let folderListItems = Object.keys(folders).map((folderId) => {
        return getFolderListItem(folders[folderId]);
      });

    let folderForm;

    if (this.state.selectedFolderId === parentFolderId) {
      folderForm = <FolderForm groupId={groupId} parentId={parentFolderId} />
    }

    return (
      <div className="folderList">
        {folderForm}
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