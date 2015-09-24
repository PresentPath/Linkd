document.addEventListener('DOMContentLoaded', function() {
  var addLinkForm = document.getElementById('addLink');
  addLinkForm.addEventListener('submit', function() {

    chrome.tabs.getSelected(null, function(tab) {

      form.action = 'http://gtmetrix.com/analyze.html?bm';
      form.method = 'post';
      var input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'url';
      input.value = tab.url;
      form.appendChild(input);
      document.body.appendChild(form);
      form.submit();
    });
  }, false);
}, false);