$(document).on('pjax:end', function () {
    // Duplicate the event with a slightly different name
    var e = document.createEvent('Events');
    e.initEvent('_pjax:end', !'bubbles', !'cancelable');

    return document.dispatchEvent(e);
});


var panel = $('div.gm_panel');

if (panel.length === 0) {
    panel = $('<div class="gm_panel"></div>').html(
        "<a href='#' class='add btn'>add this page</a>" +
        "<b>Favorites</b>" +
        "<ul></ul>" +
        "<a href='https://rawgit.com/zbycz/github-events-viewer/master/github-event-viewer.html'>My events viewer</a>" +
        "<style>" +
        ".gm_panel { position: fixed; top:0; right: 0; z-index: 10;" +
        "   background:rgba(255,255,255,0.9); border-left: 3px #d26911 solid;border-radius: 3px; width: 200px; padding: 10px 5px 15px 15px}" +
        "@media (max-width: 1400px){ .gm_panel { right:-185px; } .gm_panel:hover { right:0; } }" +
        ".gm_panel a.add.btn { font-size: 10px; float: right; padding: 2px 7px; }" +
        ".gm_panel b { line-height: 30px }" +
        ".gm_panel ul { margin-bottom: 2em; }" +
        ".gm_panel li { margin: .4em 0 0 1em; }" +
        ".gm_panel li span.rem { display: none; position: absolute; right:5px; cursor: pointer; }" +
        ".gm_panel li:hover span { display: inline; }" +
        "</style>"
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

    panel.on('click', 'span.rem', function () {
        var items = gm_get_favorites();
        items.splice($(this).attr('data-i'), 1);
        gm_set_favorites(items);
        gm_refresh_favorites();
    });
}


function gm_refresh_favorites() {
    var ul = '';
    var items = gm_get_favorites();
    for (var i in items) {
        var item = items[i];
        //var text = decodeURIComponent(item.loc.replace(/https?:\/\/[^\/]+\//, '')).replace('+', ' ');
        ul += '<li><span data-i="' + i + '" class="rem">&times;</span>  <a href="' + item.loc + '" title="' + item.title + '">' + item.text + '</a></li>'
    }
    panel.find('ul').html(ul);
}


function gm_get_favorites() {
    return JSON.parse(localStorage.getItem('gm_panel')) || [];
}
function gm_set_favorites(items) {
    localStorage.setItem('gm_panel', JSON.stringify(items));
}
