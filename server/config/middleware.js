/* 
* @Author: Katrina Uychaco
* @Date:   2015-08-02 15:21:16
* @Last Modified by:   Katrina Uychaco
* @Last Modified time: 2015-08-05 22:54:15
*/

'use strict';

// Server-Side Middleware
// ----------------------
//
// The middleware connects the Express server app with the Express routers and configures the Express app to use additional modules.

var passport = require('passport');  // authentication middleware
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');


module.exports = function(app, express) {


  // Serve static files
  // app.use(express.static(__dirname + '/../../client/src'));

  app.use(morgan('dev'));  // Log requests to console
  app.use(cookieParser());  // Read cookies (needed for auth)
  app.use(bodyParser());  // Get info from post requests

  app.set('view engine', 'ejs');  // Set up ejs for templating

  // Configure passport
  require('./passport.js')(passport);

  // User authentication
  app.use(session({ secret: 'youdontwannaknow' }));  // Session secret
  app.use(passport.initialize());  
  app.use(passport.session());  // persistent login sessions
  app.use(flash());  // use for flash messages stored in session

  // Create Express routers for each type of route
  var groupRouter = express.Router();
  var folderRouter = express.Router();
  var linkRouter = express.Router();
  var commentRouter = express.Router();

  // Connect request paths to appropriate routers
  app.use('/api/group', groupRouter);
  app.use('/api/folder', folderRouter);
  app.use('/api/link', linkRouter);
  app.use('/api/comment', commentRouter);

  // Load routes and pass in app and fully configured passport
  require('../Group/groupRouter.js')(groupRouter); 
  require('../Folder/folderRouter.js')(folderRouter); 
  require('../Link/linkRouter.js')(linkRouter); 
  require('../Comment/commentRouter.js')(commentRouter); 
  
  // Add basic routes
  require('./routes.js')(app, passport);

};
