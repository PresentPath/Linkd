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
  // return (
  //   <p> {group.id} </p>
  // );
  return (
    <Group 
      key={group.id}
      group={group} />
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
        return getGroupListItem(groups[groupId]);
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