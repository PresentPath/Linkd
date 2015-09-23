// Database Models
// ----------------
//
// Connect to the database, define Models (create schema), and set up table associations.

'use strict';

var Sequelize = require('sequelize');
var Promise = require('bluebird');

var conString = process.env.DATABASE_URL || 'mysql://root@localhost:3306/linkd';



// Connect to database
var db = new Sequelize(conString, { logging: false });

// Define models

var User = db.define('User', {
  user_id_google: { type: Sequelize.STRING, primaryKey: true },
  // token_google: Sequelize.STRING,
  name_google: Sequelize.STRING,
  email_google: Sequelize.STRING
});

var Group = db.define('Group', {
  name: Sequelize.STRING
});

var Folder = db.define('Folder', {
  name: Sequelize.STRING,
  isRoot: { type: Sequelize.BOOLEAN, defaultValue: false }
});

var Link = db.define('Link', {
  name: Sequelize.STRING,
  url: Sequelize.STRING,
  expiration_date: Sequelize.DATE
});

var Comment = db.define('Comment', {
  text: Sequelize.STRING,
});

var UserLinks = db.define('UserLinks', {
  viewed: Sequelize.BOOLEAN
});

// Set up User associations
User.belongsToMany(Group, {through: 'UserGroup'});
Group.belongsToMany(User, {through: 'UserGroup'});

Group.belongsTo(User, { as: 'Owner' });

User.belongsToMany(Link, {through: UserLinks});
Link.belongsToMany(User, {through: UserLinks});

Comment.belongsTo(User);

Folder.belongsTo(Folder, { as: 'Parent' });

Folder.belongsTo(Group);

Link.belongsTo(Folder);

Comment.belongsTo(Link);

Comment.belongsTo(Group);

// Create table based on model definitions in database
db.sync()
  .then(function() {
    console.log('Tables created');

    if (typeof run !== 'undefined') {
      console.log('Calling run to start tests');
      run();
    } else {
      // Create demo data
      if (process.env.NODE_ENV !== 'production') {
        require('./testData.js').setUpDemoData();
      }
    }

  });


module.exports.User = User;
module.exports.Group = Group;
module.exports.Folder = Folder;
module.exports.Link = Link;
module.exports.Comment = Comment;
module.exports.UserLinks = UserLinks;
module.exports.db = db;
