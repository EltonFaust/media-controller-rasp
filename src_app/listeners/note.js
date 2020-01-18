
const path = require('path');
const fs = require('fs');
const uuid = require('uuid/v4');

let db;

const use = (dbInstance) => {
    db = dbInstance;
};

const list = async () => db.all('SELECT * FROM note ORDER BY id DESC');

const get = async (id) => {
    const note = await db.get('SELECT * FROM note WHERE id = ?', id);
    const fileContent = fs.readFileSync(
        path.resolve('.', 'data', 'note', note.path),
        { encoding: 'base64' },
    );

    return { ...note, content: `data:image/png;base64,${fileContent}` };
};

const save = async (id, content) => {
    const updated = new Date().toISOString();

    if (!id) {
        const filePath = `${uuid()}.png`;

        fs.writeFileSync(
            path.resolve('.', 'data', 'note', filePath),
            content.replace(/.*;base64,/, ''),
            { encoding: 'base64' },
        );

        const { lastID } = db.run(
            'INSERT INTO note(title, path, created, updated) VALUES(?, ?, ?, ?)',
            updated.substr(0, 19).replace(/T/, ' '), filePath, updated, updated,
        );

        return lastID;
    }

    const note = await db.get('SELECT path FROM note WHERE id = ?', id);

    fs.writeFileSync(
        path.resolve('.', 'data', 'note', note.path),
        content.replace(/.*;base64,/, ''),
        { encoding: 'base64' },
    );

    await db.run('UPDATE note SET updated = ? WHERE id = ?', updated, id);

    return id;
};

const rename = async (id, newTitle) => db.run('UPDATE note SET title = ? WHERE id = ?', newTitle, id);

const duplicate = async (id) => {
    const updated = new Date().toISOString();
    const filePath = `${uuid()}.png`;

    const note = await db.get('SELECT * FROM note WHERE id = ?', id);

    fs.copyFileSync(
        path.resolve('.', 'data', 'note', note.path),
        path.resolve('.', 'data', 'note', filePath),
    );

    const { lastID } = await db.run(
        'INSERT INTO note(title, path, created, updated) VALUES(?, ?, ?, ?)',
        `Copy of ${note.title}`, filePath, updated, updated,
    );

    return db.get('SELECT * FROM note WHERE id = ?', lastID);
};

const remove = async (id) => {
    const note = await db.get('SELECT path FROM note WHERE id = ?', id);
    await db.run('DELETE FROM note WHERE id = ?', id);

    fs.unlinkSync(path.resolve('.', 'data', 'note', note.path));
};

module.exports = {
    use,
    list,
    get,
    save,
    rename,
    duplicate,
    remove,
};
