var ShowSize = {
  username: '',
  reponame: '',
  init: function() {
    if (this.isAvailable()) {
      var repoInfo = window.location.href.match(/https:\/\/github.com\/([^\/]+)\/([^\/]+)/);
      if(repoInfo.length === 3) {
        this.username = repoInfo[1];
        this.reponame = repoInfo[2];

        this.doRequest(repoInfo[1], repoInfo[2]);
      }
    }
  },
  doRequest: function(username, reponame) {
    var localStorageKey = ['GM', 'repos', username, reponame].join('-');
    if (localStorage.getItem(localStorageKey)) {
      ShowSize.doCheck(JSON.parse(localStorage.getItem(localStorageKey)));
      return;
    }

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.github.com/repos/" + username + "/" + reponame, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        localStorage.setItem(localStorageKey, xhr.responseText);
        ShowSize.doCheck(JSON.parse(xhr.responseText));
      }
    };
    xhr.send();
    console.log('[GitHub Mate] requesting api to get repo size');
  },
  doCheck: function(json) {
    if (typeof json.size !== 'undefined') {
      if (!document.querySelector('.github-mate-size')) {
        ShowSize.show.call(ShowSize, json.size);
      }
    }
    if (json.has_pages) {
      ShowSize.showGHPages();
    }
  },
  isAvailable: function() {
    if (document.querySelector('.entry-title.public') === null ||
        document.querySelector('.only-with-full-nav') === null) {
      return false;
    }
    return true;
  },
  showGHPages: function() {
    if (document.querySelector('.file-navigation.in-mid-page')) {
      document.querySelector('.file-navigation.in-mid-page').innerHTML += "<a href='http://" + this.username + ".github.io/" + this.reponame + "' data-name='gh-pages' data-skip-pjax='true' rel='nofollow' class='js-show-gh-pages btn btn-sm empty-icon tooltipped tooltipped-s right' aria-label='Goto github pages'>GH Pages</a>";
    }
  },
  show: function(size) {
    var center, outter, container;
    center = document.createElement('center');
    center.textContent = this.humanSize(size);
    outter = document.createElement('div');
    outter.setAttribute('class', 'github-mate-size');
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
