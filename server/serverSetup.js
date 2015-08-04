/* 
* @Author: Katrina Uychaco
* @Date:   2015-08-01 19:01:00
* @Last Modified by:   Katrina Uychaco
* @Last Modified time: 2015-08-03 23:17:12
*/

'use strict';

// Server Setup
// ------------
//
// This is where we configure our Express server and connect it with MySQL database.

require('./config/db_models');

var express = require('express');

// Create express server app.
var app = express();

// Connect server with routers defined in middleware file. 
require('./config/middleware.js')(app, express);

// If deployed to production then use env PORT variable. Otherwise listen on port 8000
var port = process.env.PORT || 8000;

// Server listens for requests on the appropriate port
app.listen(port);

console.log('Server is listening on port', port);


module.exports = app;