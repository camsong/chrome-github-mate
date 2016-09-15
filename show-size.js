var ShowSize = {
  username: '',
  reponame: '',
  // make sure it's the repo index page
  isAvailable: function() {
    return document.querySelector('.overall-summary.overall-summary-bottomless');
  },
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
  showGHPages: function() {
    // fix a bug: if the repo name match `username.github.io`  or `username.github.com`, then the github pages url should be `username.github.io`
    var pageUrl = "http://" + this.username + ".github.io/" + this.reponame;
    if(this.reponame === this.username + '.github.com' ||
       this.reponame === this.username + '.github.io') {
      pageUrl = 'http://' + this.username + '.github.io'
    }
    if (document.querySelector('.file-navigation.in-mid-page')) {
      // if there is no gh-pages button, add one
      if (!document.querySelector('.js-show-gh-pages')) {
        document.querySelector('.file-navigation.in-mid-page').innerHTML += "<a href='" + pageUrl + "' data-name='gh-pages' data-skip-pjax='true' rel='nofollow' class='js-show-gh-pages btn btn-sm empty-icon tooltipped tooltipped-n right btn-primary' aria-label='Goto github pages'>GH Pages</a>";
      }
    }
  },
  show: function(size) {
    var center, outter, container;
    center = document.createElement('center');
    center.textContent = this.humanSize(size);
    outter = document.createElement('div');
    outter.setAttribute('class', 'github-mate-size');
    outter.setAttribute('style', 'float:right;margin-top: 6px');
    outter.appendChild(center);
    container = document.querySelector('.reponav');
    if(container !== null)
      container.appendChild(outter);
  },
  humanSize: function(size) {
    var i = Math.floor( Math.log(size) / Math.log(1000) );
    return (size / Math.pow(1000, i)).toFixed(2) * 1 + ' ' + ['KB', 'MB', 'GB', 'TB'][i];
  }
};

ShowSize.init();
