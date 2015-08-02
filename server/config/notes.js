/* 
* @Author: Katrina Uychaco
* @Date:   2015-08-01 19:06:02
* @Last Modified by:   Katrina Uychaco
* @Last Modified time: 2015-08-01 20:07:46
*/

'use strict';

/*

Users
- passport code
- authenticate / create if doesn't exist in db

Groups
- create group (user list, name)
- add user (groupID, newUser) - check if user is owner
- delete group (owner) - check if user is owner
- get all groups for a user (userId)
- rename group (groupId, newName)

Folders
- create folder (groupId, name, parentFolder)
- delete folder
- get sub folders (parentFolder)
- rename folder (folder, newName)

Links
- add link (link, folder, name, expirationDate)
- delete link (link)
- get links (folderId) - query users_links for viewed property
- rename link (linkId, newName)
- change expiration (linkId, newExpirationDate)
- link viewed (linkId, userId) - do check to see if all users have viewed link. if so, change expiration date

Comments
- add comment (text, linkId, userId)
- get comments (linkId)

 */