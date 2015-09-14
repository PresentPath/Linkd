'use strict';

import GroupActions from '../actions/GroupActions';
import FolderActions from '../actions/FolderActions';

import FolderStore from '../stores/FolderStore';

import FolderList from './FolderList';
import LinkList from './LinkList';

import React from 'react';


let Group = React.createClass({

  updateSelectedGroup () {
    GroupActions.updateSelectedGroup(this.props.group.id);
    FolderActions.updateSelectedFolderToRoot(this.props.group.id);
  },

  render () {
    let group = this.props.group;  

    let style = {
      display: group.display
    };

    let userList = group.Users.reduce((list, user) => {
      return list + user.name_google + ', ';
    }, '').slice(0, -2);

    let contents = group.isRendered ? (
      <div className="groupContents" style={style}> 
        <span className="userList"> {userList} </span> 
        <FolderList groupId={group.id} />
        <LinkList parentFolderId={FolderStore.getRootFolderId(group.id)} />
      </div>
    ) : undefined; 

    return (
      <div className="group">
        <div className="groupName" onClick={this.updateSelectedGroup}> {group.name} </div>
        {contents}
      </div>
    );

  }

});

export default Group;