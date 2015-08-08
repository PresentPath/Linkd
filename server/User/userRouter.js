// User Router
// -----------
//
// This router further routes any requests sent to the /api/user path.
// The User controller exposes methods for interacting with the User data in the database.

var userController = require('./userController.js');

var isLoggedIn = require('../config/helpers.js').isLoggedIn;


module.exports = function(app, passport) {

  // Google Routes
  // Send to google to do authentication
  app.get('/auth/google', 
    passport.authenticate('google', { scope: ['profile', 'email'] }));

  // The callback after google has authenticated the user
  app.get('/auth/google/callback',
    passport.authenticate('google', {
      successRedirect: '/api/user/profile',
      failureRedirect: '/api/user'
    })); 

  // Home Page
  app.get('/', isLoggedIn, function(req, res) {
    res.render('profile.ejs',  { user: req.user });
  });

  // Profile section 
  // Use route middleware to verify user is logged in
  app.get('/profile', isLoggedIn, function(req, res) {
    // Get the user out of the session and pass to template
    res.render('profile.ejs', { user: req.user });
  });

  // Login
  app.get('/login', function(req, res) {
    res.render('login.ejs');
  });

  // Logout
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

};