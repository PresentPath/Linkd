'use strict';

import React from 'react';

import Header from './Header';
import Toolbar from './Toolbar';
import GroupForm from './GroupForm';
import GroupList from './GroupList';
import LinkDetail from './LinkDetail';

import UserStore from '../stores/UserStore';

import '../../stylesheets/components/app.scss';

let App = React.createClass({

  render () {
    return (
      <div className="app">
        <Header />
        <GroupForm />
        <GroupList />
        <LinkDetail />
      </div>
    );
  }

});

export default App;