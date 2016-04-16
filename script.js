// page.js injection start
var s = document.createElement('script');
    s.src = chrome.extension.getURL('page.js');
    s.onload = function() {
        this.parentNode.removeChild(this);
    };
(document.head||document.documentElement).appendChild(s);
// page.js injection end


var FileDownloader = {
  init: function() {
    FileDownloader.addDownloadTooltip();
    FileDownloader.bindPopState();

    chrome.runtime.sendMessage({key: "feature-1-enable"}, function(response) {
      if(typeof(response.result) === 'undefined' || response.result === true) {
        $(document).on('click', '.octicon-file-text', function(e) {
          FileDownloader.eventHandler(e);
        });
      } else {
        console.log('GitHub Mate click to download file is disabled, you can re-enable it in options page.');
      }
    });
  },

  addDownloadTooltip: function() {
    Array.prototype.slice.call(document.querySelectorAll('.octicon-file-text')).map(function(icon) {
      var td = icon.parentNode;
      td.classList.add('tooltipped', 'tooltipped-se');
      td.setAttribute('aria-label', 'Click to download');
    });
    // if in file detail page
    var rawUrlNode = document.querySelector('#raw-url');
    if (rawUrlNode && !document.querySelector('#download-btn')) {
      var fileName = document.querySelector('.breadcrumb .final-path').textContent;
      rawUrlNode.parentNode.innerHTML = "<a download='"+fileName+"' href='" + rawUrlNode.href + "' class='btn btn-sm' id='download-btn'>Download</a>"
          + "<a href='" + rawUrlNode.href.replace(/github.com(\/.+?\/.+?)\/raw/, 'rawgit.com$1') + "' class='btn btn-sm'>Rawgit</a>"
          + rawUrlNode.parentNode.innerHTML;

    }
  },

  bindPopState: function() {
    document.addEventListener('_pjax:end', function() {
      FileDownloader.addDownloadTooltip();
      ShowSize.init();
    }, false);
    window.onpopstate = function(event) {
      FileDownloader.addDownloadTooltip();
      ShowSize.init();
    };
  },

  eventHandler: function(event) {
    if (this.isFromListPage(event.currentTarget)) {
      var linkNode = event.currentTarget.parentNode.nextElementSibling.querySelector('a');
      var href = linkNode.href.replace('\/blob\/', '\/raw\/');
      this.downloadIt(href, linkNode.textContent);
    }
  },

  downloadIt: function(href, fileName) {
    var downloadNode = document.createElement('a');
    downloadNode.setAttribute('href', href);
    downloadNode.setAttribute('download', fileName);
    downloadNode.click();
    downloadNode = null;
  },

  isFromListPage: function(node) {
    return node.classList.contains('octicon-file-text') &&
      document.querySelector('.files') &&
      document.querySelector('.files').contains(node) &&
      document.querySelector('.file') === null;
  },
}

FileDownloader.init();

