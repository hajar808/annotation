

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
    async create() {
        const connection = getConnection();
        if (!connection) {
            console.log("Connection not open!");
            return;
        }
        let isSettingExist = await this.read();
        if (!isSettingExist) {
            let user_settings =await this.getUserSettings();
            const user_setting = {
                userId: getUserId(),
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
    async read() {
        const connection = getConnection();
        if (!connection) {
            console.log("Connection not open!");
            return;
        }
        let user_settings = await this.getUserSettings();
        if (user_settings) {
            return user_settings.find(user_setting => user_setting.userId === getUserId() && user_setting.uri === URI);
        }

    }

    /**
     * Updates setting of user for given uri
     * @param {Setting} setting 
     */
    async update(setting) {

        const user_settings = await this.getUserSettings();
        user_settings.forEach(user_setting => {
            if (user_setting.userId === getUserId() && user_setting.uri === URI) {
                user_setting.sort_type = setting.sort_type;
                COLORS.forEach(color => {
                    user_setting[color] = setting[color];
                })
            }
        });
        this.saveUserSettings(user_settings);
    }

    async delete() {
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


    async getUserSettings() {
        const connection = getConnection();
        if (!connection) {
            console.log("Connection not open!");
            return;
        }
        const user_settings = await connection.get(USER_SETTINGS);
        if (!user_settings || !user_settings.value) {
            return [];
        } else {
            return JSON.parse(user_settings.value);
        }
    }

    async saveUserSettings(user_settings) {
        const connection = getConnection();
        if (!connection) {
            console.log("Connection not open!");
            return;
        }
        connection.set({
            "key": USER_SETTINGS,
            "value": JSON.stringify(user_settings)
        }).then(
            success => {
                console.log('setting success')
            }
        );
    }

}





class AnnotationDAO {


    constructor() {
        this.annotationId = undefined;
     }

    async create(annotation) {
        const connection = getConnection();
        if (!connection) {
            console.log("Connection not open!");
            return;
        }
        let entryxist = await this.checkAnnotationEntry(getUserId(), URI);
        if (!entryxist) {
            const ID = generateUUID();
            const newEntry = {
                id: ID,
                userId: getUserId(),
                uri: URI
            }
            await this.addAnnotationEntry(newEntry);
            const annotations = [];
            annotations.push(annotation);
            connection.set({
                "key": ID,
                "value": JSON.stringify(annotations)
            });
            this.annotationListId = ID;
        } else {
            let annotations = await connection.get(this.annotationListId);
            if (annotations && annotations.value) {
                annotations = JSON.parse(annotations.value);
            } else {
                annotations = [];
            }
            
            annotations.push(annotation);
            connection.set({
                "key": this.annotationListId,
                "value": JSON.stringify(annotations)
            });
        }
    }

    async read() {
        const connection = getConnection();
        if (!connection) {
            console.log("Connection not open!");
            return;
        }
        let isExist = await this.checkAnnotationEntry(getUserId(), URI);
        if (!isExist) {
            return;
        }
        const annotations = await connection.get(this.annotationListId);
        console.log(annotations)
        if (annotations && annotations.value) {
            return JSON.parse(annotations.value);
        }
    }

    async readById(annotationId) {
        const connection = getConnection();
        if (!connection) {
            console.log("Connection not open!");
            return;
        }
        let isEntryExist = await this.checkAnnotationEntry(getUserId(), URI);
        if (!isEntryExist) {
            return;
        }
        let annotations = await connection.get(this.annotationListId);
        if (annotations && annotations.value) {
            annotations = JSON.parse(annotations.value);
            return annotations.find(annotation => annotation.id === annotationId);
        }
        
    }

    async update(annotation) {
        await this.delete(annotation.id);
        await this.create(annotation);

    }

    async delete(annotationId) {
        const connection = getConnection();
        if (!connection) {
            console.log("Connection not open!");
            return;
        }
        let isEntryExist = await this.checkAnnotationEntry(getUserId(), URI);
        if (!isEntryExist) {
            return;
        }
        let annotations = await connection.get(this.annotationListId);
        if (annotations && annotations.value) {
            annotations = JSON.parse(annotations.value);
            let filterdAnnotations = annotations.filter(annotation => { return annotation.id !== annotationId; });
            await connection.set({
                "key": this.annotationListId,
                "value": JSON.stringify(filterdAnnotations)
            });
        }
    }

    async checkAnnotationEntry(userId, uri) {
        if (this.annotationListId) {
            console.log('id exist', this.annotationListId)
            return true;
        } else {
            const entry = await this.getAnnotationEntry(userId, uri);
            if (entry) {
                this.annotationListId = entry.id;
                return true;
            }
        }
        return false;
    }

    async getAnnotationEntry(userId, uri) {
        const connection = getConnection();
        if (!connection) {
            console.log("Connection not open!");
            return;
        }
        let user_annotation_list = await connection.get(USER_ANNOTATION_LIST);
        if (user_annotation_list && user_annotation_list.value) {
            user_annotation_list = JSON.parse(user_annotation_list.value);
            return user_annotation_list.find(entry => entry.userId === userId && entry.uri === uri);
        }
    }

    async addAnnotationEntry(entry) {
        const connection = getConnection();
        if (!connection) {
            console.log("Connection not open!");
            return;
        }
        let user_annotation_list = await connection.get(USER_ANNOTATION_LIST);
        if (user_annotation_list && user_annotation_list.value) {
            user_annotation_list = JSON.parse(user_annotation_list.value);
        } else {
            user_annotation_list = [];
        }
        user_annotation_list.push(entry);
        connection.set({
            "key": USER_ANNOTATION_LIST,
            "value": JSON.stringify(user_annotation_list)
        }).then(
            success => {
                console.log('success add  entry', success)
            }
        );
    }

}

let settingDAO;
let annotationDAO;
function initDAO() {
    settingDAO = new SettingDAO();
    settingDAO.create(); // Create default settings
    annotationDAO = new AnnotationDAO();   
}
