process.chdir(__dirname);

module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
    },
    extends: [
        'airbnb-base',
    ],
    rules: {
        // auto remove console on build
        'no-console': 'off',
        'no-debugger': 'off',
        indent: ['error', 4],
        'max-len': 'off',
    },
};
