// page.js injection start
var s = document.createElement('script');
    s.src = chrome.extension.getURL('page.js');
    console.log(s);
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
        // Changed .octicon-file-text to .download-btn
        $(document).on('click', '.download-btn', function(e) {
          FileDownloader.eventHandler(e);
        });
      } else {
        console.log('GitHub Mate click to download file is disabled, you can re-enable it in options page.');
      }
    });
  },

  addDownloadTooltip: function() {
    Array.prototype.slice.call(document.querySelectorAll('.octicon-file')).map(function(icon) {
      var td = icon.parentNode;
      td.classList.add('tooltipped', 'tooltipped-se');
      td.setAttribute('aria-label', 'Click to download');
    });
    // if in file detail page
    var rawUrlNode = document.querySelector('#raw-url');
    if (rawUrlNode && !document.querySelector('.download-btn')) {
      var fileName = document.querySelector('.breadcrumb .final-path').textContent;
      let btn = document.createElement('a');
      btn.setAttribute('class', 'btn btn-sm btn-primary tooltipped tooltipped-n download-btn');
      btn.setAttribute('target','_blank');
      btn.setAttribute('rel','noreferrer');
      // btn.setAttribute('href', rawUrlNode.href);
      btn.setAttribute('download',fileName);
      btn.setAttribute('aria-label', 'Click to download ' + fileName);
      btn.textContent = 'Download';
      rawUrlNode.parentNode.parentNode.prepend(btn);
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
      var linkNode = event.currentTarget.parentNode.nextElementSibling.querySelectorAll('a:not(.tooltipped)')[0];
      // var href = linkNode.href.replace('\/blob\/', '\/raw\/');
      let href = linkNode.href.replace('/raw/','/');
      href = href.replace('https://github.com/','https://raw.githubusercontent.com/');
      // Change linkNode.textContent to event.target.download
      this.downloadIt(href, event.target.download); 
    }
  },

  downloadIt: function(href, fileName) {
    var downloadNode = document.createElement('a');
    downloadNode.setAttribute('href', href);
    downloadNode.setAttribute('rel','noopener noreferrer');
    downloadNode.setAttribute('target','_blank');
    downloadNode.setAttribute('download', fileName);
    downloadNode.click();
    downloadNode = null;
  },

  isFromListPage: function(node) {
    return node.classList.contains('download-btn') //&& // octicon-file // octicon-file-text
      // document.querySelector('.files') &&
      // document.querySelector('.files').contains(node) &&
      // document.querySelector('.file') === null;
  },
}

FileDownloader.init();



