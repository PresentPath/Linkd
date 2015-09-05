'use strict';

import React from 'react';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

let LinkDetail = React.createClass({
  
  render () {

    let link = this.props.currentLink;

    console.log('comments in link detail',this.props.comments);

    return (
      <div className="linkDetail">
        <div className="linkName"> {link.name} </div>
        <div className="linkURL"> <a href={link.url}> {link.url} </a> </div>
        <CommentList comments={this.props.comments} />
        <hr />
        <CommentForm addComment={this.props.addComment} />
      </div>
    );
  }
});

export default LinkDetail;