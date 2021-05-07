

/**
 * Data access object for settings
 */
class SettingDAO {

    constructor() {
        this.onFocus = false;
        this.group = 'private';
    }

    /**
     * Creates setting of user for uri
     */
    create() {
        if (!this.read(USER_ID, URI)) {
            let user_settings = this.getUserSettings();
            const user_setting = {
                userId: USER_ID,
                uri: URI,
                sort_type: 'newest'
            }

            COLORS.forEach(color => {
                if (!user_setting[color]) {
                    user_setting[color] = true;
                }
            })
            user_settings.push(user_setting);
            this.saveUserSettings(user_settings);
        }
    }

    /**
     * Gets setting of user for given uri
     * @param {string} userId 
     * @param {string} uri 
     */
    read() {
        let user_settings = localStorage.getItem(USER_SETTINGS);
        if (user_settings) {
            user_settings = JSON.parse(user_settings);
            return user_settings.find(user_setting => user_setting.userId === USER_ID && user_setting.uri === URI);
        }
    }

    /**
     * Updates setting of user for given uri
     * @param {Setting} setting 
     */
    update(setting) {

        const user_settings = this.getUserSettings();
        user_settings.forEach(user_setting => {
            if (user_setting.userId === USER_ID && user_setting.uri === URI) {
                user_setting.sort_type = setting.sort_type;
                COLORS.forEach(color => {
                    user_setting[color] = setting[color];
                })
            }
        });
        this.saveUserSettings(user_settings);
    }

    delete() {
        // Not required now
    }

    isOnFoucus() {
        return this.onFocus;
    }

    setOnFocus(focus) {
        this.onFocus = focus;
    }

    setGroup(group) {
        this.group = group;
    }

    getGroup() {
        return this.group;
    }


    getUserSettings() {
        let user_settings = localStorage.getItem(USER_SETTINGS);
        if (!user_settings) {
            return [];
        } else {
            return JSON.parse(user_settings);
        }
    }

    saveUserSettings(user_settings) {
        localStorage.setItem(USER_SETTINGS, JSON.stringify(user_settings));
    }

}


class AnnotationDAO {


    constructor() {
        this.annotationId = undefined;
     }

    create(annotation) {
        if (!this.checkAnnotationEntry(USER_ID, URI)) {
            const ID = generateUUID();
            const newEntry = {
                id: ID,
                userId: USER_ID,
                uri: URI
            }
            this.addAnnotationEntry(newEntry);
            const annotations = [];
            annotations.push(annotation);
            localStorage.setItem(ID, JSON.stringify(annotations));
            this.annotationListId = ID;
        } else {
            let annotations = localStorage.getItem(this.annotationListId);
            if (annotations) {
                annotations = JSON.parse(annotations);
            } else {
                annotations = [];
            }
            annotations.push(annotation);
            localStorage.setItem(this.annotationListId, JSON.stringify(annotations));
        }
    }

    read() {
        if (!this.checkAnnotationEntry(USER_ID, URI)) {
            return;
        }
        const annotations = localStorage.getItem(this.annotationListId);
        if (annotations) {
            return JSON.parse(annotations);
        }
    }

    readById(annotationId) {
        if (!this.checkAnnotationEntry(USER_ID, URI)) {
            return;
        }
        let annotations = localStorage.getItem(this.annotationListId);
        if (annotations) {
            annotations = JSON.parse(annotations);
            return annotations.find(annotation => annotation.id === annotationId);
        }
        
    }

    update(annotation) {
        this.delete(annotation.id);
        this.create(annotation);

    }

    delete(annotationId) {
        if (!this.checkAnnotationEntry(USER_ID, URI)) {
            return;
        }
        let annotations = localStorage.getItem(this.annotationListId);
        if (annotations) {
            annotations = JSON.parse(annotations);
            let filterdAnnotations = annotations.filter(annotation => { return annotation.id !== annotationId; });
            localStorage.setItem(this.annotationListId, JSON.stringify(filterdAnnotations));
        }
    }

    checkAnnotationEntry(userId, uri) {
        if (this.annotationListId) {
            return true;
        } else {
            const entry = this.getAnnotationEntry(userId, uri);
            if (entry) {
                this.annotationListId = entry.id;
                return true;
            }
        }
        return false;
    }

    getAnnotationEntry(userId, uri) {
        let user_annotation_list = localStorage.getItem(USER_ANNOTATION_LIST);
        if (user_annotation_list) {
            user_annotation_list = JSON.parse(user_annotation_list);
            return user_annotation_list.find(entry => entry.userId === userId && entry.uri === uri);
        }
    }

    addAnnotationEntry(entry) {
        let user_annotation_list = localStorage.getItem(USER_ANNOTATION_LIST);
        if (user_annotation_list) {
            user_annotation_list = JSON.parse(user_annotation_list);
        } else {
            user_annotation_list = [];
        }
        user_annotation_list.push(entry);
        localStorage.setItem(USER_ANNOTATION_LIST, JSON.stringify(user_annotation_list));
    }

}


const settingDAO = new SettingDAO();
settingDAO.create(); // Create default settings
const annotationDAO = new AnnotationDAO(); 