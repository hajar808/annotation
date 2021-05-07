let selObj;
let selRange;
let selText;
let SELECTION_ON_FIREFOX = false;

function handleSelection() {
    const selection = document.getSelection();
    const toolbar = document.getElementById(HIGHLIGHT_TOOLBAR_ID);
    if (selection && !selection.isCollapsed && !toolbar) {
        selObj = selection;
        selRange = selObj.getRangeAt(0);
        selText = selObj.toString();
        displayHighlightToolbar(selection);
    } else if (toolbar) {
        hideToolbar(toolbar);
    }
}

function handleTouchSelection(e) {
    if (isTouchDevice() && isFirefox()) {
        SELECTION_ON_FIREFOX = true;
    } else if (isTouchDevice() && !isFirefox()) {
        const toolbar = document.getElementById(HIGHLIGHT_TOOLBAR_ID);
        hideToolbar(toolbar);
        handleSelection();
        e.preventDefault();
    }
}

function handleFireFoxSelection(e) {
    if (isTouchDevice() && isFirefox() && SELECTION_ON_FIREFOX) {
        const toolbar = document.getElementById(HIGHLIGHT_TOOLBAR_ID);
        hideToolbar(toolbar);
        handleSelection();
    }
}

function isTouchDevice() {
    return ("ontouchstart" in document.documentElement);
}

function isFirefox() {
    return navigator.userAgent.toLowerCase().indexOf('firefox') !== -1;
}

function displayHighlightToolbar(selection) {
    const toolbarCallbacks = {
        onAnnotate: () => { },
        onHighlight: () => { },
        onShowAnnotations: () => { },
    };

    const toolbar = document.createElement('div');
    toolbar.id = HIGHLIGHT_TOOLBAR_ID;
    toolbar.innerHTML = HIGHLIGHT_TOOLBAR;
    document.body.appendChild(toolbar);

    const toolbarCtrl = new Adder(toolbar, toolbarCallbacks);

    const isBackwards = isSelectionBackwards(selection);
    const focusRect = selectionFocusRect(selection);

    toolbarCtrl.show(focusRect, isBackwards);
    let annotationBuilder = new AnnotationBuilder();
    let ab = annotationBuilder.highlight(selection);
    var json = JSON.stringify(ab.result, false, '  ');
    localStorage.setItem(TEMP_SELECTION_ID, json);
}

function hideToolbar(toolbar) {
    if (toolbar) {
        toolbar.remove();
        toolbar.style.display = 'none';
    }
}

function highlight(color, clazz) {
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    let date = today.toDateString()
    let time = today.toLocaleTimeString();
    let ID = date + time;
    ID = ID.replaceAll(" ", "");
    ID = ID.replaceAll(":", "")

    highlightRange(selRange, clazz, ID);

    let selection = localStorage.getItem(TEMP_SELECTION_ID);
    if (selection) {
        let annotation = JSON.parse(selection);
        annotation.id = ID;
        annotation.timestamp = timeElapsed;
        annotation.created = date + " " + time;
        annotation.color = color;
        annotation.clazz = clazz;
        annotation.excerpt = selText;
        let annotations = localStorage.getItem(ANNOTATIONS_ID);
        if (annotations) {
            annotations = JSON.parse(annotations);
            annotations.push(annotation);
        } else {
            annotations = [];
            annotations.push(annotation);
        }
        annotationDAO.create(annotation);
    }
    localStorage.removeItem(TEMP_SELECTION_ID);
    const toolbar = document.getElementById(HIGHLIGHT_TOOLBAR_ID);
    hideToolbar(toolbar);
    SELECTION_ON_FIREFOX = false;
    let existSelection = document.getSelection() || window.getSelection();
        if (existSelection) {
            existSelection.removeAllRanges();
        }
}



