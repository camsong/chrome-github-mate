var ShowSize = {
  init: function() {
    if (this.isAvailable()) {
      var repoInfo = window.location.href.match(/https:\/\/github.com\/([^\/]+)\/([^\/]+)/);
      if(repoInfo.length === 3) {
        this.doRequest(repoInfo[1], repoInfo[2]);
      }
    }
  },
  doRequest: function(username, reponame) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.github.com/repos/" + username + "/" + reponame, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        var matches = xhr.responseText.match(/"size": (\d+),/);
        if(matches && matches.length === 2 ) {
          console.log('[GitHub Mate] got repo size: ' + matches[1]);
          ShowSize.show.call(ShowSize, matches[1]);
        }
      }
    }
    xhr.send();
    console.log('[GitHub Mate] requesting api to get repo size');
  },
  isAvailable: function() {
    if (document.querySelector('.entry-title.public') === null ||
        document.querySelector('.only-with-full-nav') === null) {
      return false;
    }
    return true;
  },
  show: function(size) {
    var center, outter, container;
    center = document.createElement('center');
    center.textContent = this.humanSize(size);
    outter = document.createElement('div');
    outter.setAttribute('class', 'clone-url open github-mate-size');
    outter.appendChild(center);
    container = document.querySelector('.only-with-full-nav');
    if(container !== null)
      container.appendChild(outter);
  },
  humanSize: function(size) {
    var i = Math.floor( Math.log(size) / Math.log(1000) );
    return (size / Math.pow(1000, i)).toFixed(2) * 1 + ' ' + ['KB', 'MB', 'GB', 'TB'][i];
  }
};

ShowSize.init();
