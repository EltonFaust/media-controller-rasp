
let db;
const settings = {};

const use = (dbInstance) => {
    db = dbInstance;
};

const getEntity = (...types) => {
    if (!db) {
        throw new Error('DB instance not defined!');
    }

    const results = [];

    for (const type of types) {
        if (typeof settings[type] === 'undefined') {
            results.push(new Promise((resolve) => {
                db.get('SELECT * FROM setting WHERE type = ?', type).then((setting) => {
                    settings[type] = setting;
                    resolve(setting);
                });
            }));
        } else {
            results.push(Promise.resolve(settings[type]));
        }
    }

    if (types.length === 1) {
        return results[0];
    }

    return Promise.all(results);
};

const get = (...types) => {
    return new Promise((resolve) => {
        getEntity(...types).then((results) => {
            if (!Array.isArray(results)) {
                return resolve(typeof results !== 'undefined' ? results.value : undefined);
            }

            resolve(results.map(result => typeof result !== 'undefined' ? result.value : undefined));
        });
    });
};

const set = (type, value) => {
    if (!db) {
        throw new Error('DB instance not defined!');
    }

    return new Promise((resolve) => {
        getEntity(type).then((setting) => {
            const updated = new Date().toISOString().substr(0, 19).replace(/T/, ' ');

            new Promise((resolveUpdate) => {
                if (setting) {
                    if (value !== null) {
                        db.run(
                            'UPDATE setting SET value = ?, updated = ? WHERE id = ?',
                            value, updated, setting.id,
                        ).then(resolveUpdate);
                    } else {
                        db.run('DELETE FROM setting WHERE id = ?', setting.id).then(resolveUpdate);
                    }
                } else if (value !== null) {
                    db.run(
                        'INSERT INTO setting(type, value, updated) VALUES(?, ?, ?)',
                        type, value, updated,
                    ).then(resolveUpdate);
                } else {
                    resolveUpdate();
                }
            }).then(() => {
                delete settings[type];
                get(type).then(resolve);
            })
        });
    });
};

const rm = (type) => {
    return set(type, null);
};

const keys = {
    HOME_MIN_LINES: 1,
    HOME_ITEMS_BY_LINE: 2,
    HOME_SHOW_MEDIA_CONTROLS: 3,

    PLEX_TOKEN: 4,
    SUBTITLES_LOCALE: 5,
    // OpenSubtitles
    OS_USERNAME: 6,
    OS_PASSWORD: 7,
}


module.exports = {
    use, get, set, rm, keys,
};
