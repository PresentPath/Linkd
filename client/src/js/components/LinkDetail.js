'use strict';

import React from 'react';

import CommentList from './CommentList';
import CommentForm from './CommentForm';

import LinkStore from '../stores/LinkStore';

import '../../stylesheets/components/linkDetail.scss';

function getStateFromStores() {
  return {
    link: LinkStore.getSelectedLink()
  };
};

let LinkDetail = React.createClass({

  getInitialState () {
    return getStateFromStores();
  },

  componentDidMount () {
    LinkStore.addChangeListener(this._onChange);
  },

  componentWillUnmount () {
    LinkStore.removeChangeListener(this._onChange);
  },

  render () {

    let link = this.state.link;

    if (!link) return (<div> </div>);

    let url = link.url.search(/^https?:\/\//) !== 0 ? 'http://' + link.url : link.url;

    return (
      <div className="linkDetail">
        <div className="linkName"> {link.name} </div>
        <div className="linkURL"> <a href={url} target="_blank"> {url} </a> </div>
        <CommentList />
        <CommentForm />
      </div>
    );
  },

  _onChange () {
    this.setState(getStateFromStores());
  }

});

export default LinkDetail;
