var FileDownloader = {
  init: function() {
    document.addEventListener('click', this.eventHandler.bind(this));
  },

  eventHandler: function(event) {
    if (this.isFromListPage(event.target)) {
      var linkNode = event.target.parentNode.nextElementSibling.querySelector('a');
      var href = linkNode.href.replace('github.com', 'raw.github.com').replace('\/blob\/', '\/');
      this.downloadIt(href, linkNode.textContent);
    } else if (this.isFromFilePage(event.target) && document.querySelector('#raw-url')) {
      var href = document.querySelector('#raw-url').href;
      var fileName = document.querySelector('.breadcrumb .final-path').textContent;
      this.downloadIt(href, fileName);
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

  isFromFilePage: function(node) {
    return node.classList.contains('octicon-file-text') &&
      document.querySelector('.file') &&
      document.querySelector('.file').contains(node);
  }
}

FileDownloader.init();

