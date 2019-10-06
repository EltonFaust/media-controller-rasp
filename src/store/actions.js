
import { ACTIONS, MUTATIONS } from './_types';

export default {
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

    [ACTIONS.FETCH_NOTES]: ({ commit }) => new Promise((resolve) => {
        window.ipcRenderer.once('note-list-drawns-reply', (event, notes) => {
            commit(MUTATIONS.SET_NOTES, notes);
            resolve();
        });

        window.ipcRenderer.send('note-list-drawns');
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
};
