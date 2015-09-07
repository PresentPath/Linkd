'use strict';

import React from 'react';
import moment from 'moment';

let CommentList = React.createClass({
  
  render () {

    let commentNodes = this.props.comments.map((comment) => {
      return (
        <div key={comment.id} className="comment">
          <div>
            <span className="commentAuthor"> {comment.User.name_google} </span> 
            <span className="commentTimestamp"> {moment(comment.updatedAt).fromNow()} </span>
          </div>
          <div className="commentText"> {comment.text} </div>
        </div>
      );
    });

    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

export default CommentList;