'use strict';

import React from 'react';

let CommentForm = React.createClass({
  
  handleCommentSubmit (e) {
    e.preventDefault();
    let comment = React.findDOMNode(this.refs.comment).value.trim();
    if (comment) {
      this.props.addComment(comment);
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