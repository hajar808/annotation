
let FOCUS_NODE;

function showAnnotations(searchtext) {
    let cardsContainer = document.getElementById(CARD_CONTAINER_ID);
    if (cardsContainer) {
        cardsContainer.innerHTML = '';
    } else {
        return;
    }
    let annotations;
    const group = settingDAO.getGroup();
    if (group === 'public') {
        annotations = getPublicAnnotations();
    } else {
        annotations = annotationDAO.read(); // get own annotations
    }
    if (annotations) {
        annotations = resolveSettings(annotations, searchtext);
        generateCardList(cardsContainer, annotations, group);
    }
    openSidebar();

}

function showSelectedAnnotation(annotationId) {

    let cardsContainer = document.getElementById(CARD_CONTAINER_ID);
    const annotation = annotationDAO.readById(annotationId);

    if (annotation && cardsContainer) {
        const cardItem = buildCard(annotation, 'private')
        if (cardItem) {
            cardsContainer.innerHTML = '';
            let cardItemNode = document.createRange().createContextualFragment(cardItem);
            cardsContainer.appendChild(cardItemNode);
            openSidebar();
        }
    }

}

function generateCardList(cardsContainer, annotations, group) {

    for (let annotation of annotations) {
        const cardItem = buildCard(annotation, group);
        let cardItemNode = document.createRange().createContextualFragment(cardItem);
        cardsContainer.appendChild(cardItemNode);
    }
}

function buildCard(annotation, group) {
    return `
    <div id="${annotation.id}" class="row">
      <div class="col s12">
        <div onmouseout="focusHighlight('${annotation.id}', false)" onmouseover="focusHighlight('${annotation.id}', true)" class="card">
          <div class="card-content black-text">
              <div>
                  <span><b>Guest</b></span>
                  ${group !== 'public' ? `
                  <span class="switch">
                    <label>
                      Private
                      ${annotation.permission ? `<input onclick="changePermission('${annotation.id}', false)" type="checkbox" checked>` : `<input onclick="changePermission('${annotation.id}', true)" type="checkbox">`}
                      
                      <span class="lever"></span>
                      Public
                    </label>
                  </span>
                  `: ''}
                  <span class="card-timestamp">${annotation.created}</span>
              </div>

            <div class="excerpt-block" onclick="goToHighlight('${annotation.id}')">
              <blockquote class="annotation-quote" style="border-left-color: ${annotation.color};">${annotation.excerpt}</blockquote>
            </div>
          </div>
          ${group !== 'public' ? `
          <div class="card-action right-align">
            <div style="text-align: left; color: black;">
              <p class="comment" id="${annotation.id}-comment">${annotation.bodyValue}</p>
            </div>
            <div id="${annotation.id}-box" style="display: none;" class="row">
              <form class="col s12">
                <div class="row">
                  <div class="input-field col s12">
                    <textarea id="${annotation.id}-area" class="materialize-textarea"></textarea>
                    <label for="${annotation.id}-area" class="active">Comment</label>
                  </div>
                  <a style="cursor: pointer;" onclick="hideCommentBox(this.parentNode.parentNode.parentNode.parentNode, '${annotation.id}')" class="btn btn-small waves-effect waves-light">Cancel</a>
                  <a style="cursor: pointer;" onclick="saveComment(this.parentNode.parentNode.parentNode.parentNode, '${annotation.id}')" class="btn btn-small waves-effect waves-light">Save</a>

                </div>
              </form>
            </div>
            <div id="${annotation.id}-btn">
              <a style="cursor: pointer;" onclick="showCommentBox(this.parentNode.parentNode, '${annotation.id}')" class="btn-floating btn-small waves-effect waves-light"><i class="material-icons">create</i></a>
              <a style="cursor: pointer;" onclick="removeAnnotation('${annotation.id}')" class="btn-floating btn-small waves-effect waves-light"><i class="material-icons">delete</i></a>
            </div>
          </div>
            `: ''}
        </div>
      </div>
    </div> 
    `;
}

function removeAnnotation(id) {
    let annotation = document.getElementById(id);
    if (id) {
        annotation.remove();
        annotationDAO.delete(annotation.id);
        hideAllHighlights();
        showAllHighlights();
    }
}

function showCommentBox(node, id) {
    let annotations = annotationDAO.read();
    const commentBox = node.querySelector("#" + id + "-box");
    const cardBtn = node.querySelector("#" + id + "-btn");
    const commentArea = node.querySelector("#" + id + "-area");
    commentBox.style.display = 'block';
    cardBtn.style.display = 'none';

    if (annotations) {
        for (let annotation of annotations) {
            if (annotation.id === id && annotation.bodyValue) {
                commentArea.value = annotation.bodyValue;
                break;
            }
        }
    }
}

function hideCommentBox(node, id) {
    const commentBox = node.querySelector("#" + id + "-box");
    const cardBtn = node.querySelector("#" + id + "-btn");
    commentBox.style.display = 'none';
    cardBtn.style.display = 'block';
}

function saveComment(node, id) {
    let annotations = annotationDAO.read();
    let commentArea = node.querySelector("#" + id + "-area");
    let commentValue = node.querySelector("#" + id + "-comment");
    if (commentArea && annotations) {
        for (let annotation of annotations) {
            if (annotation.id === id) {
                annotation.bodyValue = commentArea.value;
                annotationDAO.update(annotation);
                break;
            }
        }
        commentValue.innerHTML = commentArea.value;
        hideCommentBox(node, id);
    }
}

function changePermission(annotationId, permission) {
    const annotation = annotationDAO.readById(annotationId);
    if (annotation) {
        annotation.permission = permission;
        annotationDAO.update(annotation);
    }
}

function toogleNoteBox(e, id) {
    let annotation = annotationDAO.readById(id);
    let comment = e.parentNode.querySelector(".annotation-comment");
    let noteBox = e.parentNode.querySelector(".note-box");
    let noteArea = e.parentNode.querySelector(".note-area");
    let noteBtns = e.parentNode.querySelector(".note-btns");
    let editBtn = e.parentNode.querySelector(".edit");
    let trashBtn = e.parentNode.querySelector(".trash");

    if (annotation && annotation.comment && noteArea) {
        noteArea.value = annotation.comment;
    }
    if (!noteBox.style.display || noteBox.style.display === "none") {
        noteBox.style.display = "block";
        noteBtns.style.display = "block";
        editBtn.style.display = "none";
        trashBtn.style.display = "none";
        comment.style.display = "none";
    } else {
        noteBox.style.display = "none";
        noteBtns.style.display = "none";
        editBtn.style.display = "block";
        trashBtn.style.display = "block";
        comment.style.display = "block";
    }

}

function toggleVisibility(e) {
    let visibilityElem = e.parentNode.querySelector(".visibility");
    if (visibilityElem.classList.contains('private')) {
        visibilityElem.classList.remove('private');
        visibilityElem.classList.add('public');
        visibilityElem.innerHTML = "Public";
    } else {
        visibilityElem.classList.add('private');
        visibilityElem.classList.remove('public');
        visibilityElem.innerHTML = "Private";
    }
}

function focusHighlight(annotationId, focus) {
    /* Currently disabled cause working not properly
    try {
        if (focus) {
            hideAllHighlights();
            let annotation = annotationDAO.readById(annotationId);
            if (annotation && !settingDAO.isOnFoucus()) {
                let ab = new AnnotationBuilder().fromJSON(JSON.stringify(annotation));
                ab.result.target.toSelection();
                const selection = document.getSelection();
                if (selection && !selection.isCollapsed) {
                    const range = selection.getRangeAt(0);
                    if (range) {
                        let root = range.commonAncestorContainer;
                        if (root) {
                            FOCUS_NODE = root;
                            showAllHighlights();
                            const highlights = getHighlightsContainingNode(root);
                            if (highlights && highlights.length > 0) {
                                setHighlightsFocused(highlights, true);
                            }
                        }
                    }
                }
                settingDAO.setOnFocus(true);
            }
        } else {
            let selection = document.getSelection() || window.getSelection();
            if (selection && FOCUS_NODE) {
                selection.removeAllRanges();
                const highlights = getHighlightsContainingNode(FOCUS_NODE);
                if (highlights && highlights.length > 0) {
                    setHighlightsFocused(highlights, false);
                }
                settingDAO.setOnFocus(false);
                FOCUS_NODE = undefined;
            }
        }
    } catch (e) {
        showAllHighlights();
    }
    */

}

function goToHighlight(annotationId) {
    let annotation = annotationDAO.readById(annotationId);
    let ab = new AnnotationBuilder().fromJSON(JSON.stringify(annotation));
    ab.result.target.toSelection(true);
    let selection = document.getSelection() || window.getSelection();
    if (selection) {
        selection.removeAllRanges();
    }
}

function resolveSettings(annotations, searchtext) {
    annotations = filterByColor(annotations);
    annotations = sort(annotations);
    if (searchtext) {
        annotations = filterBySearchtext(annotations, searchtext);
    }
    return annotations;
}

function filterByColor(annotations) {
    let user_setting = settingDAO.read();
    if (annotations && user_setting) {
        return annotations.filter(a => {
            return a.clazz && user_setting[a.clazz];
        });
    }
}

function sort(annotations) {
    let user_setting = settingDAO.read();
    if (annotations && user_setting) {
        const type = user_setting[SORT_KEY];
        if (type === SORT_NEWEST) {
            return annotations.sort((a, b) => b.timestamp - a.timestamp);
        } else if (type === SORT_OLDEST) {
            return annotations.sort((a, b) => a.timestamp - b.timestamp);
        }
    }
}

function filterBySearchtext(annotations, searchtext) {
    return annotations.filter(a => {
        return a.excerpt.toLowerCase().includes(searchtext.toLowerCase()) || a.bodyValue.toLowerCase().includes(searchtext.toLowerCase());
    });
}