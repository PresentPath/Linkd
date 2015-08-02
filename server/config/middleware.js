/* 
* @Author: Katrina Uychaco
* @Date:   2015-08-02 15:21:16
* @Last Modified by:   Katrina Uychaco
* @Last Modified time: 2015-08-02 15:23:33
*/

'use strict';

// Server-Side Middleware
// ----------------------
//
// The middleware connects the Express server app with the Express routers and configures the Express app to use additional modules.

module.exports = function(app, express) {
  // Serve static files
  app.use(express.static(__dirname + '/../../client/src'));
};



