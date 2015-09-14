'use strict';

import React from 'react';

import CommentActions from '../actions/CommentActions';

import LinkStore from '../stores/LinkStore';
import GroupStore from '../stores/GroupStore';
import UserStore from '../stores/UserStore';


let CommentForm = React.createClass({

  createCommentForLink(text) {
    let comment = {};
    comment.text = text;
    comment.linkId = LinkStore.getSelectedLink().id;
    comment.userId = UserStore.getUser().user_id_google;
    comment.groupId = GroupStore.getSelectedGroupId();
    
    CommentActions.createCommentForLink(comment);
    console.log('add comment', comment);
  },
  
  handleCommentSubmit (e) {
    e.preventDefault();
    let comment = React.findDOMNode(this.refs.comment).value.trim();
    if (comment) {
      this.createCommentForLink(comment);
      React.findDOMNode(this.refs.comment).value = '';
    }
    return;
  },

  render () {
    return (
      <div className="commentForm">
        <form className="newComment" onSubmit={this.handleCommentSubmit}>
          <input type="text" placeholder="New Comment" ref="comment" />
          <input type="submit" value="Add" />
        </form>
      </div>
    );
  }
});

export default CommentForm;