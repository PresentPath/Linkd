'use strict';

import React from 'react';

let LinkList = React.createClass({
  
  render () {
    let folderId = this.props.folderId;

    this.props.links['folderId_' + folderId] = this.props.links['folderId_' + folderId] || [];

    let links = this.props.links['folderId_' + folderId].filter((link) => {
      return link.FolderId === folderId;
    });

    let linkNodes = links.map((link) => {
      return <div key={link.id} onClick={this.props.updateLink.bind(null, link)}>{link.name} </div>;
    });

    return (
      <div>
        {linkNodes}
      </div>
    );
  }
});

export default LinkList;