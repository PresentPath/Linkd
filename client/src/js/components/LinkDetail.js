'use strict';

import React from 'react';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

let LinkDetail = React.createClass({
  
  render () {
    return (
      <div>
        LinkDetail
        <CommentList/>
        <CommentForm/>
      </div>
    );
  }
});

export default LinkDetail;