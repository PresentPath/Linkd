'use strict';

import React from 'react';

import LinkStore from '../stores/LinkStore';
import LinkActions from '../actions/LinkActions';
import CommentActions from '../actions/CommentActions';

function getStateFromStores(parentFolderId) {
  return {
    links: LinkStore.getLinksForFolder(parentFolderId) || []
  };
};

function updateSelectedLink (linkId) {
  LinkActions.updateSelectedLink(linkId);
  CommentActions.updateSelectedComment(linkId);
};

function getLinkListItem(link) {
  return (
    <div key={link.id} className="link" onClick={updateSelectedLink.bind(null, link)}>{link.name} </div>
  );
};

let LinkList = React.createClass({

  getInitialState () {
    return getStateFromStores(this.props.parentFolderId);
  },

  componentDidMount () {
    LinkStore.addChangeListener(this._onChange);
  },

  componentWillUnmount () {
    LinkStore.removeChangeListener(this._onChange);
  },

  render () {

    let linkListItems = this.state.links.map(getLinkListItem);

    return (
      <div className="linkList">
        {linkListItems}
      </div>
    );
  },

  _onChange () {
    this.setState(getStateFromStores(this.props.parentFolderId));
  }

});

export default LinkList;