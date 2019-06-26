
const fs   = require('fs');
const path = require('path');

if (process.env.NODE_ENV === 'development') {
    try {
        fs.symlinkSync(
            path.resolve(path.join('.', 'data')),
            path.resolve(path.join('.', 'public', 'data')),
            'dir'
        );
    } catch(e) {

    }
} else {
    try {
        fs.unlinkSync(path.resolve(path.join('.', 'public', 'data')));
    } catch(e) {

    }
}

