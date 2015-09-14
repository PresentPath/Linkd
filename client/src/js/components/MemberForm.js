'use strict';

import React from 'react';

import GroupActions from '../actions/GroupActions';

import GroupStore from '../stores/GroupStore';

let MemberForm = React.createClass({

  addMemberToGroup(userEmail) {
    let user = {
      email: userEmail,
      groupId: this.props.groupId
    };
    GroupActions.addMember(user);
  },
  
  handleMemberSubmit (e) {
    e.preventDefault();
    let userEmail = React.findDOMNode(this.refs.userEmail).value.trim();
    if (userEmail) {
      this.addMemberToGroup(userEmail);
      React.findDOMNode(this.refs.userEmail).value = '';
    }
    return;
  },

  render () {
    return (
      <div className="memberForm">
        <form className="newMember" onSubmit={this.handleMemberSubmit}>
          <input type="text" placeholder="new member" ref="userEmail" />
          <input type="submit" value="Add" />
        </form>
      </div>
    );
  }
});

export default MemberForm;