var GitHubNotification = (function(){

  var showBadgeOnZero = true;
  var interval = 30000;

  function extractUnreadNotifications(response) {
    var unreadMessages = parseInt(response.match(/<span class="count">([^<]+)</)[1]);

    return unreadMessages;
  }

  return {
    BLUE: [1, 128, 255, 255],
    GRAY: [190, 190, 190, 230],
    NOTIFICATION_URL: 'https://github.com/notifications',

    init: function(){
      GitHubNotification.checkNotifications();
      GitHubNotification.checkNotificationsAfterTimeout();

      chrome.browserAction.onClicked.addListener(function() {
        window.open(GitHubNotification.NOTIFICATION_URL);
      });
    },

    checkNotificationsAfterTimeout: function(){
      GitHubNotification.INTERVAL_BETWEEN_CHECK_NOTIFICATIONS = interval;

      window.setTimeout(
        function(){
          GitHubNotification.checkNotifications();
          GitHubNotification.checkNotificationsAfterTimeout();
        },
        GitHubNotification.INTERVAL_BETWEEN_CHECK_NOTIFICATIONS
      );
    },

    checkNotifications: function() {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", GitHubNotification.NOTIFICATION_URL, true);

      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          var response = xhr.response;

          // not logged in
          if (response.match(/<body class="logged_out/)) {
            chrome.browserAction.setBadgeBackgroundColor({color: GitHubNotification.GRAY});
            chrome.browserAction.setBadgeText({text: '?'});
            chrome.browserAction.setTitle({title: chrome.i18n.getMessage("github_login_needed")});
            return;
          }

          // logged in
          var unreadNotifications = extractUnreadNotifications(response) + "";

          chrome.browserAction.setBadgeBackgroundColor({color: GitHubNotification.BLUE});

          chrome.browserAction.setBadgeText({
            text: unreadNotifications != "0" ? unreadNotifications : ''
          });

          var notificationsInflection = (unreadNotifications == 1 ?
              'notification' : 'notifications');

          var title = unreadNotifications + " unread " + notificationsInflection;
          chrome.browserAction.setTitle({title: title});
        }
      }
      xhr.send(null);
    }
  };

})();

GitHubNotification.init();
