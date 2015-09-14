# Linkd
Share and discuss bookmarks!

[Mockup](https://linkd.mybalsamiq.com/mockups/3486949.png?key=0a9e3983347c60c76ed228db07e3c591114b25dc)

[![Circle CI](https://circleci.com/gh/PresentPath/Linkd.svg?style=svg)](https://circleci.com/gh/PresentPath/Linkd)


# Challenges

**Problem:** 
Asynchronous running of test spec files - During database testing, test spec files for the different models were being run asynchronously resulting in jumbled results output to the console. Also, the tests were being run before the database schema was fully loaded, resulting in a "Table doesn't exist" error. 

![mochaTestOutput](https://cloud.githubusercontent.com/assets/7910250/9267514/37235e50-4205-11e5-9758-a0e54d37457c.png)

**Solution:**



**Problem:** 
When creating a new group and corresponding root folder and rendering the new group we need to pass the `rootFolderId` to the `LinkDetail` component. When retrieving `_folders[groupId].rootFolderId` using `FolderStore.getRootFolderId(groupId)`, the `_folders` object in the store doesn't yet have the new group (\_folders[groupId] = undefined). Thus we get an error "Cannot  property 'rootFolderId' of undefined".

The issue is that `Group` is re-rendering too soon. 

**Solution:**
Be the interpreter... Walked through the entire chain of operations starting with creating a new group and took note of what change events were triggered and when. Here's where the problem lied:

```javascript
createGroup(group) {
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
```

Found the following two issues:

1) Removed the change event emission in receiveCreatedGroup.

2) Switched these two actions:

GroupActions.receiveCreatedGroup(rawGroup);
--> FolderActions.receiveCreatedFolder(rawFolder);
--> GroupActions.updateSelectedGroup(rawGroup.id);
FolderActions.updateSelectedFolderToRoot(rawGroup.id);

updateSelectedGroup was emitting a change event, triggering a re-render, before receiveCreatedFolder added the group and root folder to the _folders object.