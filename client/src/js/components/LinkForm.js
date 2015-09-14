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
    return (
      <div className="linkForm">
        <form className="newLink" onSubmit={this.handleLinkSubmit}>
          <input type="text" placeholder="new link name" ref="linkName" />
          <input type="text" placeholder="new link url" ref="linkURL" />
        </form>
      </div>
    );
  }
});

export default LinkForm;