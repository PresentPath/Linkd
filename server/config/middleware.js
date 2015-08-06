/* 
* @Author: Katrina Uychaco
* @Date:   2015-08-02 15:21:16
* @Last Modified by:   Katrina Uychaco
* @Last Modified time: 2015-08-05 22:44:15
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

  // Create Express routers for each type of route
  var userRouter = express.Router();
  // var groupRouter = express.Router();
  // var folderRouter = express.Router();
  // var linkRouter = express.Router();
  // var commentRouter = express.Router();

  // Configure passport
  require('./passport.js')(passport);

  // Serve static files
  // app.use(express.static(__dirname + '/../../client/src'));

  app.use(morgan('dev'));  // Log requests to console
  app.use(cookieParser());  // Read cookies (needed for auth)
  app.use(bodyParser());  // Get info from post requests

  app.set('views', '../../views');
  app.set('view engine', 'ejs');  // Set up ejs for templating

  // User authentication
  app.use(session({ secret: 'youdontwannaknow' }));  // Session secret
  app.use(passport.initialize());  
  app.use(passport.session());  // persistent login sessions
  app.use(flash());  // use for flash messages stored in session

  // Connect request paths to appropriate routers
  app.use('/api/user', userRouter);
  // app.use('/api/group', groupRouter);
  // app.use('/api/folder', folderRouter);
  // app.use('/api/link', linkRouter);
  // app.use('/api/comment', commentRouter);

  // Load routes and pass in app and fully configured passport
  // require('../users/userRoutes.js')(userRouter, passport); 
  // require('../groups/groupRoutes.js')(groupRouter); 
  // require('../folders/folderRoutes.js')(folderRouter); 
  // require('../links/linkRoutes.js')(linkRouter); 
  // require('../comments/commentRoutes.js')(commentRouter); 
  
  // Add basic routes
  require('./routes.js')(app, passport);

};



