'use strict';

$('document').ready(function() {

  $.ajax({
    url: '/api/user/list',
    method: 'GET',
  })
  .done(function(data) {
    data.forEach(function(user) {
      $('#usersList').append('<li data-id=' + user.user_id_google + '>' + user.name_google + '</li>');
    });
  });

  $.ajax({
    url: '/api/group/list',
    method: 'GET',
  })
  .done(function(data) {
    console.log('### DATA', data);
    data.forEach(function(group) {
      $('#groupsList').append('<li data-id=' + group.id + '>' + group.name + '</li>');
    });
  });

});
