/* 
* @Author: Katrina Uychaco
* @Date:   2015-08-01 18:30:40
* @Last Modified by:   Katrina Uychaco
* @Last Modified time: 2015-08-02 15:18:18
*/

'use strict';

// Server-Side Entry Point
// -----------------------
//
// This is where we configure our server to use the appropriate port and being listening for requests.

// Import the Express app which is configured in the serverSetup.js file
var app = require('./server/serverSetup.js').app;

// If deployed to production then use env PORT variable. Otherwise listen on port 8000
var port = process.env.PORT || 8000;

// Server listens for requests on the appropriate port
app.listen(port);

console.log('Server is listening on port', port);
