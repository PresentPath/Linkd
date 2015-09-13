'use strict';

import React from 'react';
import Group from './Group';

import GroupStore from '../stores/GroupStore';

import '../../stylesheets/components/groupList.scss';

function getStateFromStores() {
  return {
    groups: GroupStore.getGroups()
  };
};

function getGroupListItem(group) {
  return (
    <Group 
      key={group.id}
      group={group}
      folders={this.props.folders}
      links={this.props.links} 
      updateGroup={this.props.updateGroup}
      updateFolder={this.props.updateFolder}
      updateLink={this.props.updateLink} />
  );
};

let GroupList = React.createClass({

  getInitialState () {
    return getStateFromStores();
  },

  componentDidMount () {
    GroupStore.addChangeListener(this._onChange);
  },

  componentWillUnmount () {
    GroupStore.removeChangeListener(this._onChange);
  },

  render () {

    let groups = this.state.groups;

    let groupListItems = Object.keys(groups).map((groupId) => {
        getGroupListItem(groups[groupId]);
      });

    return (
      <div className="groupList">
        {groupListItems}
      </div>
    );
  },

  _onChange () {
    this.setState(getStateFromStores());
  }

});

export default GroupList;