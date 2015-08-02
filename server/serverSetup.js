/* 
* @Author: Katrina Uychaco
* @Date:   2015-08-01 19:01:00
* @Last Modified by:   Katrina Uychaco
* @Last Modified time: 2015-08-02 15:21:05
*/

'use strict';

// Server Setup
// ------------
//
// This is where we configure our Express server and connect it with MySQL database.

var express = require('express');

// Create express server app.
var app = express();

// Connect server with routers defined in middleware file. 
require('./config/middleware.js')(app, express);

module.exports.app = app;