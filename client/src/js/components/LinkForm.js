'use strict';

import React from 'react';

import LinkActions from '../actions/LinkActions';

let LinkForm = React.createClass({

  createLink(link) {
    link.folderId = this.props.parentId;
    LinkActions.createLink(link);
  },
  
  handleLinkSubmit (e) {
    e.preventDefault();
    let name = React.findDOMNode(this.refs.linkName).value.trim();
    let url = React.findDOMNode(this.refs.linkURL).value.trim();
    if (name && url) {
     this.createLink({ name, url });
    }
    React.findDOMNode(this.refs.linkName).value = '';
    React.findDOMNode(this.refs.linkURL).value = '';
    return;
  },

  render () {
    let style = {
      display: 'none'
    };

    return (
      <div className="linkForm">
        <form className="newLink" onSubmit={this.handleLinkSubmit}>
          <input type="text" placeholder="add link name" ref="linkName" />
          <input type="text" placeholder="add link url" ref="linkURL" />
          <input type="submit" style={style} />
        </form>
      </div>
    );
  }
});

export default LinkForm;