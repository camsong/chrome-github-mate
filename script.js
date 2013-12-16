var FileDownloader = (function(){
  return {
    init: function() {
      document.addEventListener('click', FileDownloader.eventHandler);
    },
    eventHandler: function(event) {
      if (FileDownloader.fromListPage(event.target)) {
        var linkNode = event.target.parentNode.nextElementSibling.querySelector('a');
        var href = linkNode.href.replace('github.com', 'raw.github.com').replace('\/blob\/', '\/');
        FileDownloader.downloadIt(href, linkNode.textContent);
      } else if (FileDownloader.fromFilePage(event.target) && document.querySelector('#raw-url')) {
        var href = document.querySelector('#raw-url').href;
        var fileName = document.querySelector('.breadcrumb .final-path').textContent;
        FileDownloader.downloadIt(href, fileName);
      }
    },
    downloadIt: function(href, fileName) {
      var downloadNode = document.createElement('a');
      downloadNode.setAttribute('href', href);
      downloadNode.setAttribute('download', fileName);
      downloadNode.click();
      downloadNode = null;
    },
    fromListPage: function(node) {
      return node.classList.contains('octicon-file-text') &&
        document.querySelector('.files') &&
        document.querySelector('.files').contains(node) &&
        document.querySelector('.file') === null;
    },
    fromFilePage: function(node) {
      return node.classList.contains('octicon-file-text') &&
        document.querySelector('.file') &&
        document.querySelector('.file').contains(node);
    }
  };
})();

FileDownloader.init();

