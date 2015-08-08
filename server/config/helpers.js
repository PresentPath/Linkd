/* 
* @Author: Katrina Uychaco
* @Date:   2015-08-05 19:37:19
* @Last Modified by:   kuychaco
* @Last Modified time: 2015-08-07 19:33:35
*/

'use strict';

module.exports.isLoggedIn = function(req, res, next) {
  
  // If user is authenticated in the session, continue
  if (req.isAuthenticated()) return next();
  // Otherwise, re-direct to home page
  res.redirect('/api/user/login');

};