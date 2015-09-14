'use strict';

import React from 'react';
import moment from 'moment';

import CommentStore from '../stores/CommentStore';
import LinkStore from '../stores/LinkStore';

function getStateFromStores() {
  console.log('get comments');
  var linkId = LinkStore.getSelectedLink().id;
  return {
    comments: CommentStore.getCommentsForLink(linkId) || []
  };
};

function getCommentListItem(comment) {
  return (
    <div key={comment.id} className="comment">
      <div>
        <span className="commentAuthor"> {comment.User.name_google} </span> 
        <span className="commentTimestamp"> {moment(comment.updatedAt).fromNow()} </span>
      </div>
      <div className="commentText"> {comment.text} </div>
    </div>
  );
};

let CommentList = React.createClass({

  getInitialState () {
    console.log('get comment state');
    return getStateFromStores();
  },

  componentDidMount () {
    CommentStore.addChangeListener(this._onChange);
    LinkStore.addChangeListener(this._onChange);
    this._scrollToBottom();
  },

  componentWillUnmount () {
    CommentStore.removeChangeListener(this._onChange);
    LinkStore.removeChangeListener(this._onChange);
  },

  componentDidUpdate () {
    this._scrollToBottom();
  },

  _scrollToBottom () {
    let node = this.getDOMNode();
    node.scrollTop = node.scrollHeight;
  },

  render () {

    let commentListItems = this.state.comments.map(getCommentListItem);

    return (
      <div className="commentList">
        {commentListItems}
      </div>
    );
  },

  _onChange () {
    this.setState(getStateFromStores(this.props.linkId));
  }

});

export default CommentList;