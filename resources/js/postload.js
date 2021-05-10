document.addEventListener('DOMContentLoaded', function () {
    let elems = document.querySelectorAll('.sidenav');
    M.Sidenav.init(elems, { edge: 'right' });

});

document.addEventListener('selectionchange', (event) => {
    handleFireFoxSelection(event);
});

//showAllHighlights();
