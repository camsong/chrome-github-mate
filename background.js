;(function(){
'use strict';

var GitHubNotification;
var notificationUrl = 'https://github.com/notifications';
var blue = [1, 128, 255, 255];
var gray = [190, 190, 190, 230];

function _isNotificationUrl(url) {
  return url.indexOf(notificationUrl) === 0;
}

function _goToNotificationTab() {
  console.log('Going to notification tab...');
  chrome.tabs.getAllInWindow(undefined, function(tabs) {
    for (var i = 0, tab; tab = tabs[i]; i++) {
      if (tab.url && _isNotificationUrl(tab.url)) {
        console.log('Found notification tab: ' + tab.url + '. ' +
                    'Focusing and refreshing count...');
        chrome.tabs.update(tab.id, {selected: true});
        GitHubNotification.checkNotifications();
        return;
      }
    }
    console.log('Could not find notification tab. Creating one...');
    chrome.tabs.create({url: notificationUrl});
  });
}

function _extractUnreadNotifications(response) {
  return parseInt(response.match(/<span class="count">([^<]+)</)[1]);
}

function _loginWarning() {
  chrome.browserAction.setBadgeBackgroundColor({color: gray});
  chrome.browserAction.setBadgeText({text: '?'});
  chrome.browserAction.setTitle({title: chrome.i18n.getMessage("github_login_needed")});
}

function _getBadgeText(num) {
  return num != 0 ? num+'' : ''
}

function _getTitle(num) {
  return num + " unread " +
         (num == 1 ? 'notification' : 'notifications');
}

function _displayUnreadCount(response) {
  var unreadCount = _extractUnreadNotifications(response);
  console.log('Get ' + unreadCount + ' unread notifications');

  chrome.browserAction.setBadgeBackgroundColor({color: blue});
  chrome.browserAction.setBadgeText({text: _getBadgeText(unreadCount)});

  chrome.browserAction.setTitle({title: _getTitle(unreadCount)});
}

GitHubNotification = {
  config: {
    interval: 30000,
  },

  init: function() {
    this.checkNotifications();
    this.checkNotificationsLoop();

    chrome.browserAction.onClicked.addListener(this.goToNotificationTab.bind(this));
  },

  goToNotificationTab: _goToNotificationTab,

  checkNotificationsLoop: function(){
    window.setTimeout(
      function(){
        GitHubNotification.checkNotifications();
        GitHubNotification.checkNotificationsLoop();
      },
      GitHubNotification.config.interval
    );
  },

  checkNotifications: function() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        var response = xhr.response;

        if (response.match(/<body class="logged_out/)) {
          // not logged in
          console.log('not logged in currently');
          _loginWarning();
        } else {
          // logged in
          _displayUnreadCount(response);
        }
      }
    };
    xhr.open("GET", notificationUrl, true);
    console.log('making request to get notifications...');
    xhr.send(null);
  }
};

GitHubNotification.init();

})();
