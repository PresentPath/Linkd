'use strict';

import React from 'react';
import Folder from './Folder';

import FolderStore from '../stores/FolderStore';

function getStateFromStores(groupId) {
  return {
    folders: FolderStore.getFoldersForGroup(groupId)
  };
};

function getFolderListItem(folder) {
  return (
    <p> {folder.id} </p>
  );
  // return (
  //   <Folder 
  //     key={folder.id}
  //     folder={folder} />
  // );
};

let FolderList = React.createClass({

  getInitialState () {
    return getStateFromStores(this.props.groupId);
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
    this.setState(getStateFromStores());
  }

});

export default FolderList;