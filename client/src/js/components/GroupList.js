'use strict';

import React from 'react';
import Group from './Group';

let GroupList = React.createClass({
  
  render () {
    let groupNodes = this.props.groups.map((group) => {
      return (
        <Group 
          key={group.id}
          folders={this.props.folders}
          links={this.props.links} 
          updateGroup={this.props.updateGroup}
          updateFolder={this.props.updateFolder}
          updateLink={this.props.updateLink} />
      );
    })
    return (
      <div className="groupList">
        <h3>GroupList</h3>
        {groupNodes}
        <hr />
      </div>
    );
  }
});

export default GroupList;