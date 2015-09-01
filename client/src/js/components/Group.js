'use strict';

import React from 'react';
import FolderList from './FolderList';

/*
Group
- props: 
  - updateGroup
  - updateFolder
  - updateLink
  - folders
  - links
 */

let Group = React.createClass({

  render () {
    let group = this.props.group;  

    let userList = group.Users.reduce((list, user) => {
      return list + user.name_google + ', ';
    }, '').slice(0, -2);

    let contents = group.isLoaded ? (
      <div className="groupContents" visibiliy={group.visibility}> 
        <span className="userList"> {userList} </span> 
        <FolderList 
          folders={this.props.folders}
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