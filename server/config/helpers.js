/* 
* @Author: Katrina Uychaco
* @Date:   2015-08-05 19:37:19
* @Last Modified by:   kuychaco
* @Last Modified time: 2015-08-21 18:10:00
*/

'use strict';

var R = require('ramda');

module.exports.isLoggedIn = function(req, res, next) {
  
  // If user is authenticated in the session, continue
  if (req.isAuthenticated()) return next();
  // Otherwise, re-direct to home page
  res.redirect('/api/user/login');

};

// Handle error when interacting with database
// TODO: Refactor all controllers to use this method
module.exports.handleError = R.curry(function(res, message, err) {
  console.error(message, err.message);
  res.status(500).send(err.message);
});

module.exports.handleSuccess = R.curry(function(res, message, result) {
  // console.log(message);
  res.send(result);
});

module.exports.deleteInstances = function(Model) {
  return Model.findAll()
    .then(function(instances) {
      return instances.map(function(instance) {
        return instance.destroy();
      });
    })
    .then(function(deleted) {
      // console.log('Dropped table for', Model);
      return deleted;
    })
    .catch(function(err) {
      console.error('Error deleting all instances', err.message);
    });
};