'use strict';

import React from 'react';

import FolderActions from '../actions/FolderActions';

let FolderForm = React.createClass({

  createFolder(folderName) {
    let folder = {
      name: folderName,
      groupId: this.props.groupId,
      parentId: this.props.parentId
    };
    
    FolderActions.createFolder(folder);
  },
  
  handleFolderSubmit (e) {
    e.preventDefault();
    let folderName = React.findDOMNode(this.refs.folderName).value.trim();
    if (folderName) {
      this.createFolder(folderName);
      React.findDOMNode(this.refs.folderName).value = '';
    }
    return;
  },

  render () {
    return (
      <div className="folderForm">
        <form className="newFolder" onSubmit={this.handleFolderSubmit}>
          <input type="text" placeholder="add folder" ref="folderName" />
        </form>
      </div>
    );
  }
});

export default FolderForm;