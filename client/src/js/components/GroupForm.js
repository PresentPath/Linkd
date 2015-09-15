'use strict';

import React from 'react';

import GroupActions from '../actions/GroupActions';

import UserStore from '../stores/UserStore';

let GroupForm = React.createClass({

  createGroup(groupName) {
    let group = {};
    group.name = groupName;
    group.userId = UserStore.getUser().user_id_google;
    
    GroupActions.createGroup(group);
  },
  
  handleGroupSubmit (e) {
    e.preventDefault();
    let groupName = React.findDOMNode(this.refs.groupName).value.trim();
    if (groupName) {
      this.createGroup(groupName);
      React.findDOMNode(this.refs.groupName).value = '';
    }
    return;
  },

  render () {
    return (
      <div className="groupForm">
        <form className="newGroup" onSubmit={this.handleGroupSubmit}>
          <input type="text" placeholder="add group" ref="groupName" />
        </form>
      </div>
    );
  }
});

export default GroupForm;