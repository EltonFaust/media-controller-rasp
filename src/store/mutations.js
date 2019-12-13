import Vue from 'vue';

import { ACTION_MODES, MUTATIONS } from './_types';

export default {
    [MUTATIONS.SET_AS_LOADING]: (state, isLoading) => {
        Vue.set(state, 'isLoading', isLoading);
    },

    [MUTATIONS.SET_SETTINGS]: (state, config) => {
        Vue.set(state.home, 'minLines', config.home_min_lines);
        // state. =
    },
    [MUTATIONS.SET_HOME_ACTIONS]: (state, config) => {
        Vue.set(state.home, 'minLines', config.home_min_lines);
        // state. =
    },

    [MUTATIONS.SET_NOTES]: (state, notes) => {
        state.notes = notes;
    },

    [MUTATIONS.ADD_NOTE]: (state, { note, mode }) => {
        if (mode === ACTION_MODES.PREPEND_DATA) {
            state.notes.unshift(note);
        } else if (mode === ACTION_MODES.APPEND_DATA) {
            state.notes.push(note);
        }
    },

    [MUTATIONS.SET_NOTE_NAME]: (state, { editId, newTitle }) => {
        const editIdx = state.notes.findIndex(({ id }) => id === editId);

        if (editIdx !== -1) {
            Vue.set(state.notes[editIdx], 'title', newTitle);
        }
    },

    [MUTATIONS.DELETE_NOTE]: (state, removeId) => {
        const rmIdx = state.notes.findIndex(({ id }) => id === removeId);

        if (rmIdx !== -1) {
            Vue.delete(state.notes, rmIdx);
        }
    },

    // ------------ MEDIA ------------
    [MUTATIONS.SET_MEDIA_SERVER_ADDRESS]: (state, addresses) => {
        Vue.set(state.media, 'serverAddress', addresses);
    },
    [MUTATIONS.SET_MEDIA_AS_CONFIGURED]: (state, isConfigured) => {
        Vue.set(state.media, 'isConfigured', isConfigured);
    },
    [MUTATIONS.SET_MEDIA_LIST]: (state, { mediaType, list }) => {
        if (['movies', 'shows'].indexOf(mediaType) !== -1) {
            Vue.set(state.media.list, mediaType, list);
        }
    },
    [MUTATIONS.SET_SHOW_SEASON_DETAIL]: (state, { showKey, seasonKey, episodes }) => {
        if (!state.media.list.shows) {
            return;
        }

        const showIdx = state.media.list.shows.findIndex(({ key }) => key === showKey);

        if (showIdx === -1) {
            return;
        }

        const seasonIndex = state.media.list.shows[showIdx].seasons.findIndex(({ key }) => key === seasonKey);

        if (seasonIndex === -1) {
            return;
        }

        Vue.set(state.media.list.shows[showIdx].seasons[seasonIndex], 'episodes', episodes);
    },
};
