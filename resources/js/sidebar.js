

function openSidebar() {
    
    let elem = document.querySelector('.sidenav');
    let instance = M.Sidenav.getInstance(elem);

    if (instance) {
        instance.open();
    }
    /*
    let elem = document.querySelector('.sidenav');
    if (elem.classList.contains('close')) {
        elem.classList.remove('close');
        elem.classList.add('open')
    }else if (elem.classList.contains('open')) {
        elem.classList.remove('open');
        elem.classList.add('close')
    } else {
        elem.classList.add('open')
    }
    */

}

function closeSidebar() {
    /*
    let elem = document.querySelector('.sidenav');
    if (elem.classList.contains('open')) {
        elem.classList.remove('open');
    }
    elem.classList.add('close')
    */
    let elem = document.querySelector('.sidenav');
    let instance = M.Sidenav.getInstance(elem);

    if (instance) {
        instance.close();
    }
    
}

async function changeSort(sortType, label) {
    const setting = await settingDAO.read();
    if (setting) {
        setting[SORT_KEY] = sortType;
        await settingDAO.update(setting);
        await showAnnotations();
        const badge = document.getElementById('sort-badge');
        badge.setAttribute('data-badge-caption', label);
    }

}

async function changeAnnotationGroup(group, label) {
    settingDAO.setGroup(group);
    await showAnnotations();
    const badge = document.getElementById('group-badge');
    badge.setAttribute('data-badge-caption', label);
    if (group === 'private') {
        await showAllHighlights();
    }

}

async function updateColorFilter(color, visibility) {
    const setting = await settingDAO.read();
    if (setting) {
        setting[color] = visibility;
        await settingDAO.update(setting);
        await showAnnotations();
    }
}

function searchAnnotations(searchtext) {
    showAnnotations(searchtext);

}

function clearSearch() {
    document.getElementById('search').value = '';
    showAnnotations();
}
