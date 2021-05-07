
const TEXT_CONTENT_ID = 'text-content';
const BLUE = 'blue-highlight';
const GREEN = 'green-highlight';
const YELLOW = 'yellow-highlight';
const ORANGE = 'orange-highlight';
const NOTE_CARD_CONTAINER_ID = 'card-container';
const MENU_TOGGLE_ID = 'menu-toggle';
//const ANNOTATIONS_ID = 'annotations';
const CARD_CONTAINER_ID = 'card-container';
const SORT_KEY = 'sort_type';
const SORT_NEWEST = 'newest';
const SORT_OLDEST = 'oldest';
const USER_SETTING = 'user_setting';
const HIGHLIGHT_TOOLBAR_ID = 'highlight-toolbar';
const ANNOTATIONS_ID = 'annotations';
const TEMP_SELECTION_ID = 'tempSelection';
const TEXT_CONTENT = 'text-content';

const USER_SETTINGS = "user_settings";
const USER_ANNOTATION_LIST = "user_annotation_list";
const USER_ANNOTATIONS = "user_annotations";

const USER_ANNOTATION = "user_annoation_map";

const COLORS = ['blue-highlight', 'green-highlight', 'yellow-highlight', 'orange-highlight'];


const USER_ID = 'user-' + getRandomInt(3);
const URI = window.location.origin; // window.location.href;

//const settingDAO = new SettingDAO();
//const annotationDAO = new AnnotationDAO();

const HIGHLIGHT_TOOLBAR = `
<div class="annotation-highlight">
    <a onclick="highlight('#6AD0CA', 'blue-highlight')" class="btn-floating btn-small waves-effect waves-light blue-highlight"></a>
    <a onclick="highlight('#6BD59A', 'green-highlight')" class="btn-floating btn-small waves-effect waves-light green-highlight"></a>
    <a onclick="highlight('#DFCA45', 'yellow-highlight')" class="btn-floating btn-small waves-effect waves-light yellow-highlight"></a>
    <a onclick="highlight('#E86F52', 'orange-highlight')" class="btn-floating btn-small waves-effect waves-light orange-highlight"></a>
</div>
`;

let HIGHLIGHT_IS_VISIBLE = true;

function generateUUID() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function showAllHighlights() {
    let annotations = annotationDAO.read();
    if (annotations) {
        hideAllHighlights();
        for (let ann of annotations) {
            var ab2 = new AnnotationBuilder().fromJSON(JSON.stringify(ann));
            ab2.result.target.toSelection();
            const selection = document.getSelection();
            if (selection && !selection.isCollapsed) {
                const range = selection.getRangeAt(0);
                highlightRange(range, ann.clazz, ann.id);
            }
        }
        let selection = document.getSelection() || window.getSelection();
        if (selection) {
            selection.removeAllRanges();
        }
        HIGHLIGHT_IS_VISIBLE = true;
    }
}

function hideAllHighlights() {
    const root = document.getElementById(TEXT_CONTENT_ID);
    removeAllHighlights(root);
    HIGHLIGHT_IS_VISIBLE = false;
}

function toggleHighlights() {
    if (HIGHLIGHT_IS_VISIBLE) {
        hideAllHighlights();
        HIGHLIGHT_IS_VISIBLE = false;
        document.getElementById('eye-on').style.display = 'none';
        document.getElementById('eye-off').style.display = 'block';
    } else {
        showAllHighlights();
        HIGHLIGHT_IS_VISIBLE = true;
        document.getElementById('eye-on').style.display = 'block';
        document.getElementById('eye-off').style.display = 'none';
    }
}


$(document).ready(function () {
    $("#group").dropdown();
    $("#sort").dropdown();
});