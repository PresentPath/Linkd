'use strict';

import React from 'react';

let Toolbar = React.createClass({

  handleGroupSubmit (e) {
    e.preventDefault();
    let groupName = React.findDOMNode(this.refs.groupName).value.trim();
    if (groupName) {
      this.props.addGroup(groupName);
      React.findDOMNode(this.refs.groupName).value = '';
    }
    return;
  },

  handleUserSubmit (e) {
    e.preventDefault();
    let userEmail = React.findDOMNode(this.refs.userEmail).value.trim();
    if (userEmail) {
      this.props.addUserToGroup(userEmail);
      React.findDOMNode(this.refs.userEmail).value = '';
    }
    return;
  },

  handleFolderSubmit (e) {
    e.preventDefault();
    let folderName = React.findDOMNode(this.refs.folderName).value.trim();
    if (folderName) {
      this.props.addFolder(folderName);
      React.findDOMNode(this.refs.folderName).value = '';
    }
    return;
  },

  handleLinkSubmit (e) {
    e.preventDefault();
    let linkName = React.findDOMNode(this.refs.linkName).value.trim();
    let linkURL = React.findDOMNode(this.refs.linkURL).value.trim();
    if (linkName && linkURL) {
      this.props.addLink({ linkName, linkURL });
    }
    React.findDOMNode(this.refs.linkName).value = '';
    React.findDOMNode(this.refs.linkURL).value = '';
    return;
  },
  
  render () {

    return (
      <div className="toolbar">
        Toolbar
        
        <form className="newGroup" onSubmit={this.handleGroupSubmit}>
          <input type="text" placeholder="New Group" ref="groupName" />
          <input type="submit" value="Add" />
        </form>

        <form className="newUser" onSubmit={this.handleUserSubmit}>
          <input type="text" placeholder="New User" ref="userEmail" />
          <input type="submit" value="Add" />
           to {this.props.currentGroup}
        </form>

        <form className="newFolder" onSubmit={this.handleFolderSubmit}>
          <input type="text" placeholder="New Folder" ref="folderName" />
          <input type="submit" value="Add" />
           to {this.props.currentPath}

        </form>

        <form className="newLink" onSubmit={this.handleLinkSubmit}>
          <input type="text" placeholder="New Link Name" ref="linkName" />
          <input type="text" placeholder="New Link URL" ref="linkURL" />
          <input type="submit" value="Add" />
        </form>

        <hr />

      </div>
    );
  }
});

export default Toolbar;