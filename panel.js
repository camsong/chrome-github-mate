/*
 * @file Right panel of github mate, including favorites and markdown outline
 * @thanks-to originaly implemented by github.com/zbycz
 */

function gm_get_favorites() {
  return JSON.parse(localStorage.getItem('github-mate-panel-favorites')) || [{
    loc: 'https://github.com/rubyerme/chrome-github-mate',
    text: 'Default by OctoMate',
    title: 'default entry'
  }];
}

function gm_set_favorites(items) {
  localStorage.setItem('github-mate-panel-favorites', JSON.stringify(items));
}

// use lastString to avoid rerendering
var lastString = '';

function gm_refresh_favorites() {
  var ul = '';
  var items = gm_get_favorites();
  for (var i in items) {
    var item = items[i];
    //var text = decodeURIComponent(item.loc.replace(/https?:\/\/[^\/]+\//, '')).replace('+', ' ');
    ul += '<li><span data-i="' + i + '" class="edit">&#9998;</span>  <a href="' + item.loc + '" title="' + item.title + '">' + item.text + '</a></li>'
  }
  if (ul != lastString) {
    lastString = ul;
    panelNode.find('ul.github-mate-favorites').html(ul);
  }
}

// put panelNode in global
var panelNode = $('div.github-mate-panel');

function initPanelNode() {
  if (panelNode.length === 0) {
    let isCollapse = localStorage.getItem('github-mate-panel-collapse') === 'true';

    panelNode = $('<div class="github-mate-panel' + (isCollapse ? ' collapse' : '') + '"></div>').html(
      "<a href='javascript:;' class='add btn'>➕</a>" +
      "<a href='javascript:;' class='toggle btn collapse'></a>" +
      "<b>Favorites</b>" +
      "<ul class='github-mate-favorites'></ul>" +
      "<div class='github-mate-outline'></div>"
    );
    $('body').append(panelNode);

    setInterval(gm_refresh_favorites, 5000);
    gm_refresh_favorites();

    panelNode.on('click', 'a.toggle', function (e) {
      $('.github-mate-panel').toggleClass('collapse');
      localStorage.setItem('github-mate-panel-collapse', $('.github-mate-panel').hasClass('collapse'));
      $(e.target).blur();
    });

    panelNode.on('click', 'a.add', function (e) {
      var path = location.pathname.split('/'); // /winsite/iprace_fe/issues/779
      var text = prompt('Add this page, edit title:', path[2] + ' ' + document.title);

      if (!text) return;

      var items = gm_get_favorites();
      items.push({
        loc: location.toString(),
        title: document.title,
        text: text
      });
      gm_set_favorites(items);
      gm_refresh_favorites();
      e.preventDefault();
    });

    panelNode.on('click', 'span.edit', function () {
      var items = gm_get_favorites();
      var i = $(this).attr('data-i');

      var pr = window.prompt('Set new title OR set blank to delete', items[i].text);
      if (pr === null) return;
      else if (pr === '') items.splice(i, 1);
      else items[i].text = pr;

      gm_set_favorites(items);
      gm_refresh_favorites();
    });
  }
}

function updateOutlinesInPanel() {
  var $container = document.createElement('div')
  $container.classList.add('github-mate-outline')

  Array.from(document.querySelectorAll('.markdown-body:not(.comment-body):not(.message)')).forEach($md => {
    var $headers = Array.from($md.querySelectorAll(headerSel))


    var $b = document.createElement('b')
    $b.innerText = "Outline"
    $container.appendChild($b)

    var $outline = document.createElement('ul')
    $container.appendChild($outline)

    // generate outline from headers
    $headers.forEach($h => {
      var level = getHeaderLevel($h)
      if (!level) return
      var $ul = $outline,
        $li, $child
      for (var l = 1; l < level; l++) {
        $li = $ul.lastChild || $ul.appendChild(document.createElement('li'))
        $child = $li.lastChild || {}
        $ul = $child.tagName === 'UL' ? $child : $li.appendChild(document.createElement('ul'))
      }
      var $topic = $ul
        .appendChild(document.createElement('li'))
        .appendChild(document.createElement('a'))
      $topic.innerText = $h.innerText
      $topic.href = `#${$h.querySelector(anchorSel).id.replace(/^user-content-/, '')}`
    })

    // find all sublists with one item and replace with contents
    Array.from($container.querySelectorAll('ul')).forEach($ul => {
      try {
        var $parent = $ul.parentNode
        var $li = $ul.firstChild
        var $child = $li.firstChild
        if ($li !== $ul.lastChild || $child.tagName !== 'UL') return
        while ($child) {
          $parent.insertBefore($child, $ul.nextSibling) // inserts to end of list if $ul.nextSibling is null
          $child = $child.nextSibling
        }
        $parent.removeChild($ul)
      } catch (e) {
        console.log("Error setting up GitHub Mate panel:", e)
      }
    })
  })

  panelNode.find('.github-mate-outline').replaceWith($container);
}


// Copyright (c) 2015 Dan Kaplun
// The MIT License (MIT)
// from https://github.com/dbkaplun/github-markdown-outline-extension/blob/master/index.js
// very hackily edited by zbycz to add it in panel
getHeaderLevel.REGEXP = /h(\d)/i

function getHeaderLevel($h) {
  var level = Number(((($h || {}).tagName || '').match(getHeaderLevel.REGEXP) || [])[1])
  return isNaN(level) ? undefined : level
}

var headerSels = []
for (var l = 1; l <= 6; l++) headerSels.push('h' + l)
var headerSel = headerSels.join(', ')
var anchorSel = 'a[id]'

var Panel = {
  init: function () {
    chrome.runtime.sendMessage({
      key: "feature-4-enable"
    }, function (response) {
      if (typeof (response.result) === 'undefined' || response.result === true) {
        Panel.constructor();
      }
    });
  },

  constructor: function () {
    // update after changed page with pjax
    $(document).on('pjax:end', function () {
      updateOutlinesInPanel();
    });
    initPanelNode();
    updateOutlinesInPanel();
  },

};

Panel.init();
