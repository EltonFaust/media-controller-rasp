
const fs = require('fs');
const path = require('path');

const lsPath = path.resolve(path.join('.', 'public', 'data'));

if (process.env.NODE_ENV === 'development') {
    if (!fs.existsSync(lsPath)) {
        fs.symlinkSync(
            path.resolve(path.join('.', 'data')),
            lsPath,
            'dir',
        );
    }
} else if (fs.existsSync(lsPath)) {
    fs.unlinkSync(lsPath);
}
