
async function showMostHighligted(label) {
    const badge = document.getElementById('group-badge');
    badge.setAttribute('data-badge-caption', label);

    const root = document.getElementById(TEXT_CONTENT_ID);
    let mergedAnnotations = await mergeAnnotations();
    let sorted_list = mergedAnnotations.sort((a1, a2) => a2.counter - a1.counter);

    if (sorted_list && sorted_list.length > 0) {
        let annotation = sorted_list[0].value;
        if (annotation) {
            removeAllHighlights(root);
            var ab = new AnnotationBuilder().fromJSON(JSON.stringify(annotation));
            ab.result.target.toSelection();
            const selection = document.getSelection();
            if (selection && !selection.isCollapsed) {
                const range = selection.getRangeAt(0);
                highlightRange(range, 'most-highligt');
                closeSidebar();
            }
        }
    }
}


async function getPublicAnnotations() {
    const connection = getConnection();
    if (!connection) {
        console.log("Connection not open!");
        return;
    }
    let annotation_list = await connection.get(USER_ANNOTATION_LIST);
    const public_annotations = [];
    if (annotation_list && annotation_list.value) {
        annotation_list = JSON.parse(annotation_list.value);
        for(let annotation_item of annotation_list) {
            let annotatons = await connection.get(annotation_item.id);
            if (annotatons.value) {
                annotatons = JSON.parse(annotatons.value);
                annotatons.forEach(annotation => {
                    if (annotation.permission) {
                        public_annotations.push(annotation);
                    }
                })
            }
        }
    }
    return public_annotations;
}


async function mergeAnnotations() {
    
    const merged_items = [];
    const connection = getConnection();
    if (!connection) {
        console.log("Connection not open!");
        return;
    }
    let annotation_list = await connection.get(USER_ANNOTATION_LIST);
    if (annotation_list && annotation_list.value) {
        annotation_list = JSON.parse(annotation_list.value);
        for(let annotation_item of annotation_list) {
            let annotations = await connection.get(annotation_item.id);
            if (annotations && annotations.value) {
                annotations = JSON.parse(annotations.value);
                merge(merged_items, annotations);
            }
        }
    }

    return merged_items;
}

function merge(list, annotations) {

    for (let annotation of annotations) {
        if (list.length === 0) {
            const newItem = {
                counter: 1,
                value: annotation,
                selector: annotation.target.selector
            }
            list.push(newItem);
            continue;
        }

        let ann_selectors = annotation.target.selector;
        let found_item;
        ann_selectors.forEach(selector1 => {
            found_item = list.find(item => item.selector.find(selector2 => compare(selector1, selector2)));
            if (found_item) {
                return;
            }
        });
        if (found_item) {
            found_item.counter += 1;
        } else {
            const newItem = {
                counter: 1,
                value: annotation,
                selector: annotation.target.selector
            }
            list.push(newItem);
        }


    }

}

function compare(selector1, selector2) {
    if ((selector1.type === 'XPathSelector'
        && selector1.type === selector2.type
        && selector1.value === selector2.value) ||
        (selector1.type === 'TextQuoteSelector'
            && selector1.type === selector2.type
            && selector1.exact === selector2.exact
            && selector1.prefix === selector2.prefix
            && selector1.suffix === selector2.suffix) ||
        (selector1.type === 'TextPositionSelector'
            && selector1.type === selector2.type
            && selector1.start === selector2.start
            && selector1.end === selector2.end)) {
        return true;
    }
    return false;
}


mergeAnnotations();