var App = require('./components/App');
var WebAPIUtils = require('./utils/WebAPIUtils');
var React = require('react');

window.React = React; // export for http://fb.me/react-devtools

WebAPIUtils.getUser();

React.render(
  <App />, 
  document.getElementById('main')
);