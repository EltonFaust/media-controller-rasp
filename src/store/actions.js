
import { ACTIONS, ACTION_MODES, MUTATIONS } from './_types';

export default {
    // ------------ SETTINGS ------------
    [ACTIONS.FETCH_SETTINGS]: ({ commit, state }) => new Promise((resolve) => {
        if (state.isSettingsLoaded) {
            resolve();
            return;
        }

        window.ipcRenderer.once('fetch-settings-reply', (e, settings) => {
            commit(MUTATIONS.SET_SETTINGS, settings);
            commit(MUTATIONS.SET_SETTINGS, {});
            resolve();
        });

        window.ipcRenderer.send('fetch-settings');
    }),

    [ACTIONS.FETCH_HOME_ACTIONS]: ({ commit }) => new Promise((resolve) => {
        commit(MUTATIONS.SET_HOME_ACTIONS, {});
        resolve();
    }),

    // ------------ NOTES ------------
    [ACTIONS.FETCH_NOTES]: ({ commit }) => new Promise((resolve) => {
        window.ipcRenderer.once('note-list-drawns-reply', (event, notes) => {
            commit(MUTATIONS.SET_NOTES, notes);
            resolve();
        });

        window.ipcRenderer.send('note-list-drawns');
    }),
    [ACTIONS.SAVE_NOTE]: (_, { id, content }) => new Promise((resolve) => {
        window.ipcRenderer.once('note-drawn-save-reply', () => {
            resolve();
        });

        window.ipcRenderer.send('note-drawn-save', { id, content });
    }),
    [ACTIONS.DUPLICATE_NOTE]: ({ commit }, id) => new Promise((resolve) => {
        window.ipcRenderer.once('note-drawn-duplicate-reply', (event, note) => {
            commit(MUTATIONS.ADD_NOTE, { note, mode: ACTION_MODES.PREPEND_DATA });
            resolve();
        });

        window.ipcRenderer.send('note-drawn-duplicate', id);
    }),
    [ACTIONS.RENAME_NOTE]: ({ commit }, { editId, newTitle }) => new Promise((resolve) => {
        window.ipcRenderer.once('note-rename-reply', () => {
            commit(MUTATIONS.SET_NOTE_NAME, { editId, newTitle });
            resolve();
        });

        window.ipcRenderer.send('note-rename', { id: editId, title: newTitle });
    }),
    [ACTIONS.REMOVE_NOTE]: ({ commit }, removeId) => new Promise((resolve) => {
        window.ipcRenderer.once('note-remove-reply', () => {
            commit(MUTATIONS.DELETE_NOTE, removeId);
            resolve();
        });

        window.ipcRenderer.send('note-remove', removeId);
    }),

    // ------------ MEDIA ------------
    [ACTIONS.START_MEDIA_SERVER]: ({ commit }) => new Promise((resolve) => {
        window.ipcRenderer.once('media-server-start-reply', (event, addresses, isConfigured) => {
            commit(MUTATIONS.SET_MEDIA_SERVER_ADDRESS, addresses);
            commit(MUTATIONS.SET_MEDIA_AS_CONFIGURED, isConfigured);
            resolve();
        });

        window.ipcRenderer.send('media-server-start');
    }),
    [ACTIONS.CLOSE_MEDIA_SERVER]: ({ commit }) => new Promise((resolve) => {
        window.ipcRenderer.once('media-server-close-reply', () => {
            commit(MUTATIONS.SET_MEDIA_SERVER_ADDRESS, []);
            commit(MUTATIONS.SET_MEDIA_AS_CONFIGURED, false);
            resolve();
        });

        window.ipcRenderer.send('media-server-close');
    }),
    [ACTIONS.WAIT_MEDIA_CONFIGURE]: ({ commit }) => new Promise((resolve) => {
        console.log(ACTIONS.WAIT_MEDIA_CONFIGURE);

        window.ipcRenderer.once('media-wait-configure-reply', () => {
            commit(MUTATIONS.SET_MEDIA_AS_CONFIGURED, true);
            resolve();
        });

        window.ipcRenderer.send('media-wait-configure');
    }),
};
