/* 
* @Author: Katrina Uychaco
* @Date:   2015-08-02 15:21:16
* @Last Modified by:   kuychaco
* @Last Modified time: 2015-08-08 12:19:09
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

var isLoggedIn = require('./helpers.js').isLoggedIn;

module.exports = function(app, express) {

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
  var userRouter = express.Router();
  var groupRouter = express.Router();
  var folderRouter = express.Router();
  var linkRouter = express.Router();
  var commentRouter = express.Router();

  // // FOR PRODUCTION
  // // Connect request paths to appropriate routers
  // app.use('/api/user', userRouter);
  // app.use('/api/group',isLoggedIn, groupRouter);
  // app.use('/api/folder',isLoggedIn, folderRouter);
  // app.use('/api/link',isLoggedIn, linkRouter);
  // app.use('/api/comment',isLoggedIn, commentRouter);

  // FOR DEV ONLY - Unprotected endpoints 
  // Connect request paths to appropriate routers
  app.use('/api/user', userRouter);
  app.use('/api/group', groupRouter);
  app.use('/api/folder', folderRouter);
  app.use('/api/link', linkRouter);
  app.use('/api/comment', commentRouter);

  // Load routes and pass in app and fully configured passport
  require('../User/userRouter.js')(userRouter, passport); 
  require('../Group/groupRouter.js')(groupRouter); 
  require('../Folder/folderRouter.js')(folderRouter); 
  require('../Link/linkRouter.js')(linkRouter); 
  require('../Comment/commentRouter.js')(commentRouter); 
  
  // Add route for initial get request  
  app.get('/', isLoggedIn, function(req, res) {
    res.redirect('/index.html');
  });

  // Serve static files
  app.use(express.static(__dirname + '/../../client/dist'));

};
