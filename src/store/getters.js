
export default {
    mediaSeasonEpisiodes(state) {
        return (showKey, seasonKey) => {
            if (!state.media.list.shows) {
                return [];
            }

            const showIdx = state.media.list.shows.findIndex(({ key }) => key === showKey);

            if (showIdx === -1) {
                return [];
            }

            const seasonIndex = state.media.list.shows[showIdx].seasons.findIndex(({ key }) => key === seasonKey);

            if (seasonIndex === -1) {
                return [];
            }

            return state.media.list.shows[showIdx].seasons[seasonIndex];
        };
    },
};
