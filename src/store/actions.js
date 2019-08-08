
import { ACTIONS, MUTATIONS } from './_types';

export default {
    [ACTIONS.FETCH_SETTINGS]: ({ commit, state }) => new Promise((resolve) => {
        if (state.isSettingsLoaded) {
            resolve();
            return;
        }

        window.ipcRenderer.once('fetch-settings-reply', (e, settings) => {
            console.log(settings);
            commit(MUTATIONS.SET_SETTINGS, {});
            resolve();
        });

        window.ipcRenderer.send('fetch-settings');
    }),

    [ACTIONS.FETCH_HOME_ACTIONS]: ({ commit }) => new Promise((resolve) => {
        commit(MUTATIONS.SET_HOME_ACTIONS, {});
        resolve();
    }),
};
