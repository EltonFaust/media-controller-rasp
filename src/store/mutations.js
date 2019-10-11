import Vue from 'vue';

import { ACTION_MODES, MUTATIONS } from './_types';

export default {
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
};
