$(document).on('pjax:end', function () {
    // Duplicate the event with a slightly different name
    var e = document.createEvent('Events');
    e.initEvent('_pjax:end', !'bubbles', !'cancelable');

    updateOutlinesInPanel()

    return document.dispatchEvent(e);
});


// Sidebar panel originaly by github.com/zbycz

var panel = $('div.gm_panel');

if (panel.length === 0) {
    panel = $('<div class="gm_panel"></div>').html(
        "<a href='#' class='add btn'>add this page</a>" +
        "<b>Favorites</b>" +
        "<ul class='favorites'></ul>" +
        "<style>" +
        ".gm_panel { position: fixed; top:0; right: 0; z-index: 10;" +
        "   background:rgba(255,255,255,0.9); border-left: 3px #d26911 solid;border-radius: 3px; width: 200px; padding: 10px 5px 15px 15px;" +
        "   max-height:100%;overflow-y:auto}" +
        "@media (max-width: 1400px){ .gm_panel { right:-185px; } .gm_panel:hover { right:0; } }" +
        ".gm_panel a.add.btn { font-size: 10px; float: right; padding: 2px 7px; }" +
        ".gm_panel b { line-height: 30px }" +
        ".gm_panel ul.favorites { margin-bottom: 2em; }" +
        ".gm_panel li { margin: .4em 0 0 1em; }" +
        ".gm_panel li span.edit { display: none; position: absolute; right:5px; cursor: pointer; }" +
        ".gm_panel li:hover span { display: inline; }" +
        "</style>" +
        "<div class='gm_outline'></div>"

    );
    $('body').append(panel);

    setInterval(gm_refresh_favorites, 2000);
    gm_refresh_favorites();

    panel.on('click', 'a.add', function () {
        var path = location.pathname.split('/'); // /winsite/iprace_fe/issues/779
        var text = prompt('Edit title:', path[2] + ' ' + document.title);

        if (!text) return;

        var items = gm_get_favorites();
        items.push({
            loc: location.toString(),
            title: document.title,
            text: text
        });
        gm_set_favorites(items);
        gm_refresh_favorites();

        return false;
    });

    panel.on('click', 'span.edit', function () {
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
        panel.find('ul.favorites').html(ul);
    }
}


function gm_get_favorites() {
    return JSON.parse(localStorage.getItem('gm_panel')) || [{loc: 'https://rawgit.com/zbycz/github-events-viewer/master/github-event-viewer.html', text: 'My GH events', title:'default entry'}];
}
function gm_set_favorites(items) {
    localStorage.setItem('gm_panel', JSON.stringify(items));
}




// Copyright (c) 2015 Dan Kaplun
// The MIT License (MIT)
// from https://github.com/dbkaplun/github-markdown-outline-extension/blob/master/index.js
// very hackily edited by zbycz to add it in panel

getHeaderLevel.REGEXP = /h(\d)/i
function getHeaderLevel ($h) {
    var level = Number(((($h || {}).tagName || '').match(getHeaderLevel.REGEXP) || [])[1])
    return isNaN(level) ? undefined : level
}

var headerSels = []
for (var l = 1; l <= 6; l++) headerSels.push('h'+l)
var headerSel = headerSels.join(', ')
var anchorSel = 'a[id]'

function updateOutlinesInPanel() {
    var $container = document.createElement('div')
    $container.classList.add('gm_outline')

    Array.from(document.querySelectorAll('.markdown-body')).forEach($md => {
        var $headers = Array.from($md.querySelectorAll(headerSel))


        var $b = document.createElement('b')
        $b.innerText = "Outline"
        $container.appendChild($b)

        var $outline = document.createElement('ul')
        //$outline.classList.add('__github-markdown-outline')
        $container.appendChild($outline)

        // generate outline from headers
        $headers.forEach($h => {
            var level = getHeaderLevel($h)
            if (!level) return
            var $ul = $outline, $li, $child
            for (var l = 1; l < level; l++) {
                $li = $ul.lastChild || $ul.appendChild(document.createElement('li'))
                $child = $li.lastChild || {}
                $ul = $child.tagName === 'UL'
                    ? $child
                    : $li.appendChild(document.createElement('ul'))
            }
            var $topic = $ul
                .appendChild(document.createElement('li'))
                .appendChild(document.createElement('a'))
            $topic.innerText = $h.innerText
            $topic.href = `#${$h.querySelector(anchorSel).id.replace(/^user-content-/, '')}`
        })

        // find all sublists with one item and replace with contents
        Array.from($container.querySelectorAll('ul')).forEach($ul => {
            var $parent = $ul.parentNode
            var $li = $ul.firstChild
            var $child = $li.firstChild
            if ($li !== $ul.lastChild || $child.tagName !== 'UL') return
            while ($child) {
                $parent.insertBefore($child, $ul.nextSibling) // inserts to end of list if $ul.nextSibling is null
                $child = $child.nextSibling
            }
            $parent.removeChild($ul)
        })

    })

    //$md.insertBefore($container, $md.firstChild)
    panel.find('.gm_outline').replaceWith($container);
}

updateOutlinesInPanel();