# Linkd
Share and discuss bookmarks!

[linkd.herokuapp.com](https://linkd.herokuapp.com)

[![Circle CI](https://circleci.com/gh/PresentPath/Linkd.svg?style=svg)](https://circleci.com/gh/PresentPath/Linkd)


# Challenges

## Asynchronicity with Mocha Testing
**Problem:** 

Asynchronous running of test spec files - During database testing, test spec files for the different models were being run asynchronously resulting in jumbled results output to the console. Also, the tests were being run before the database schema was fully loaded, resulting in a "Table doesn't exist" error. 

### Jumbled test output:
![mochaTestOutput](https://cloud.githubusercontent.com/assets/7910250/9267514/37235e50-4205-11e5-9758-a0e54d37457c.png)

We have two separate problems here:
1) Spec files being run asynchronously. 
2) Tests running before database is set up.

**Solution:**

1) This may not be the most elegant solution, but it's one that makes sense to me and allows me to have some fun with Promises. Surprisingly, Google searching didn't yield much, so just went with this implementation:

###Exported spec files
Invoked callback in last test to resolve promise.
```javascript

module.exports = function(CALLBACK) {
  // User Controller
  describe('----- User Router/Controller tests -----', function() {
    
    it('should do stuff', function(done) { /* stuff */ });
    it('should do other stuff', function(done) { /* other stuff */ });
    it('should retrieve users from the database', function(done) {

        request(app)
          .get('/api/user/list')
          .end(function(err, res) {
            if (err) {
              CALLBACK(err);
              return done(err);
            }
            // assertions
            CALLBACK();
            done();
          });

    });
  });

};

```

###Master spec file
Created promise chain to run tests synchronously.
```javascript

var userSpec = Promise.promisify(require('../User/userSpec.js'));
var groupSpec = Promise.promisify(require('../Group/groupSpec.js'));
var folderSpec = Promise.promisify(require('../Folder/folderSpec.js'));
var linkSpec = Promise.promisify(require('../Link/linkSpec.js'));
var commentSpec = Promise.promisify(require('../Comment/commentSpec.js'));

describe('database controller tests', function() {

  userSpec()
  .then(function() {
    return groupSpec();
  })
  .then(function() {
    return folderSpec();
  })
  .then(function() {
    return linkSpec();
  })
  .then(function() {
    return commentSpec();
  })
  .catch(function(err) {
    console.error('Error testing database controllers:', err);
  });

});
```


## React+Flux Rendering

**Problem:** 
When creating a new group and corresponding root folder and rendering the new group we need to pass the `rootFolderId` to the `LinkDetail` component. When retrieving `_folders[groupId].rootFolderId` using `FolderStore.getRootFolderId(groupId)`, the `_folders` object in the store doesn't yet have the new group (\_folders[groupId] = undefined). Thus we get an error "Cannot  property 'rootFolderId' of undefined".

The issue is that `Group` is re-rendering too soon. 

**Solution:**

Be the interpreter... Walked through the entire chain of operations starting with creating a new group and took note of what change events were triggered and when. Here's where the problem lied:

```javascript
function createGroup (group) {
  $.post('/api/group/create', group)
    .done((response) => {
      var rawGroup = response[0];
      var rawFolder = response[1];
      GroupActions.receiveCreatedGroup(rawGroup); // Triggered change event
      GroupActions.updateSelectedGroup(rawGroup.id); // Triggered change event
      FolderActions.receiveCreatedFolder(rawFolder); // Creates _folders[groupId] object and sets rootFolderId property
      FolderActions.updateSelectedFolderToRoot(rawGroup.id); // Sets display property and _path so that views can be rendered appropriately
    })
    .fail((err) => {
      console.error('Error creating group', group.id, status, err.toString());
    });
}
```

Found the following two issues:

1) Removed the change event emission in receiveCreatedGroup.

2) Switched these two actions:

GroupActions.receiveCreatedGroup(rawGroup);
--> FolderActions.receiveCreatedFolder(rawFolder);
--> GroupActions.updateSelectedGroup(rawGroup.id);
FolderActions.updateSelectedFolderToRoot(rawGroup.id);

updateSelectedGroup was emitting a change event, triggering a re-render, before receiveCreatedFolder added the group and root folder to the _folders object.
