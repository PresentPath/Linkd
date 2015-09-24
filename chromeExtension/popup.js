$(function() {
  $('#addLink').submit(function(event) {
    event.preventDefault();
    console.log('sdfdsf');

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

      var data = {
        folder: $('#folder').val(),
        name: $('#name').val(),
        url: tabs[0].url
      };

      $.post('http://127.0.0.1:8000/api/link/plugin/create', data)
      .done(function(result) {
        console.log(result);
      });

    });

  });
});
