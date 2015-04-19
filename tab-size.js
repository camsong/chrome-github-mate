var TabSize = {
  init: function() {
    chrome.runtime.sendMessage({key: "feature-3-tab-size"}, function(response) {
      var tabSize = response.result || '4';
      document.body.classList.add('github-mate-tab-size-' + tabSize);
    });
  }
};

TabSize.init();
