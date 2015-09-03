'use strict';

import React from 'react';
import FolderList from './FolderList';

let Group = React.createClass({

  render () {
    let group = this.props.group;  

    let style = {
      display: group.display
    };

    let userList = group.Users.reduce((list, user) => {
      return list + user.name_google + ', ';
    }, '').slice(0, -2);

    this.props.folders['groupId_' + group.id] = this.props.folders['groupId_' + group.id] || [];

    let rootFolder = this.props.folders['groupId_' + group.id].filter((folder) => {
      return folder.isRoot;
    })[0];

    let contents = group.isRendered ? (
      <div className="groupContents" style={style}> 
        <span className="userList"> {userList} </span> 
        <FolderList 
          parentFolderId={rootFolder.id}
          folders={this.props.folders['groupId_' + group.id]}
          links={this.props.links}
          updateFolder={this.props.updateFolder}
          updateLink={this.props.updateLink} />
      </div>
    ) : undefined; 

    return (
      <div className="group">
        <h4 onClick={this.props.updateGroup.bind(null, group)}> {group.name} </h4>
        {contents}
      </div>
    );

  }
});

export default Group;