;(function(){
'use strict';

// message listener to accept request from content script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('get message request: key=' + request.key);
  sendResponse({result: getConfig()[request.key]});
});

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

// type can be unread/participating
function _extractUnreadNotifications(response) {
  var type = getConfig()['feature-2-type'];

  if (type === 'participating') {
    return parseInt(response.match(/<span class="count">(\d+)</g)[1].match(/\d+/g)[0]);
  }
  // unread and others
  return parseInt(response.match(/<span class="count">(\d+)</g)[0].match(/\d+/g)[0]);
}

function _loginWarning() {
  chrome.browserAction.setBadgeBackgroundColor({color: gray});
  chrome.browserAction.setBadgeText({text: '?'});
  chrome.browserAction.setTitle({title: chrome.i18n.getMessage("github_login_needed")});
}

function _getBadgeText(num) {
  return num + '';// num != 0 ? num+'' : ''
}

function _getTitle(num) {
  return num + " unread " +
         (num == 1 ? 'notification' : 'notifications');
}

function _displayUnreadCount(unreadCount) {
  if (unreadCount > 0) {
    chrome.browserAction.setBadgeBackgroundColor({color: blue});
    chrome.browserAction.setBadgeText({text: _getBadgeText(unreadCount)});
  } else {
    chrome.browserAction.setBadgeBackgroundColor({color: '#999'});
    chrome.browserAction.setBadgeText({text: ' '});
  }

  chrome.browserAction.setTitle({title: _getTitle(unreadCount)});
}

GitHubNotification = {
  getInterval: function() {
    return parseInt(getConfig()['feature-2-interval']) * 60 * 1000;
  },

  isEnabled: function() {
    return getConfig()['feature-2-enable'];
  },

  init: function() {
    this.checkNotificationsLoop();

    chrome.browserAction.onClicked.addListener(this.goToNotificationTab.bind(this));
  },

  goToNotificationTab: _goToNotificationTab,

  checkNotificationsLoop: function(){
    // check notification again if it's enabled and the date range since last checked is longer
    // than interval.
    if (GitHubNotification.isEnabled()) {
      if (!localStorage.getItem('last_checked_date') ||
        (Date.now() - localStorage.getItem('last_checked_date')) >= GitHubNotification.getInterval()
      ) {
        this.checkNotifications(true);
        localStorage.setItem('last_checked_date', Date.now());
      } else {
        this.checkNotifications(false);
      }
    }

    // loop;
    window.setTimeout(GitHubNotification.checkNotificationsLoop.bind(GitHubNotification), 10000);
  },

  checkNotifications: function(makeRequest) {
    if (makeRequest) {
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
            var unreadCount = _extractUnreadNotifications(response);
            console.log('Get ' + unreadCount + ' unread notifications');

            var type = getConfig()['feature-2-type'];
            localStorage.setItem('unreadNotifications' + type, unreadCount);
            _displayUnreadCount(unreadCount);
          }
        }
      };
      xhr.open("GET", notificationUrl, true);
      console.log('making request to get notifications...');
      xhr.send(null);
    } else {
      var type = getConfig()['feature-2-type'];
      var unreadCount = localStorage.getItem('unreadNotifications' + type);
      _displayUnreadCount(unreadCount);
    }
  }
};

GitHubNotification.init();

})();
