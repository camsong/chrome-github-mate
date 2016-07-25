document.addEventListener('pjax:end', function () {
    // Duplicate the event with a slightly different name
    var e = document.createEvent('Events');
    e.initEvent('_pjax:end', !'bubbles', !'cancelable');

    return document.dispatchEvent(e);
});
