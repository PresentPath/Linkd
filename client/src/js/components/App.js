'use strict';

import React from 'react';

let App = React.createClass({
  render () {
    return (
      <div>
        Hello World!
      </div>
    );
  }
});

React.render(<App/>, document.body);
