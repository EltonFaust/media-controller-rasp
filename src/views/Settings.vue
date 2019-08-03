<template>
    <div class="settings">
        <nav-actions>
            <span></span>
            <b-link :to="{ name: 'note-drawn' }" class=""><i class="material-icons">note_add</i> Add</b-link>
        </nav-actions>
    </div>
</template>

<style lang="scss" scoped>
    .settings {
    }
</style>

<script>
export default {
    name: 'settings',
    // data() {
    //     return {
    //         notes: [],
    //         newTitle: '',
    //         editingId: null,
    //         keyboardInstace: null,
    //     };
    // },
    mounted() {
        // window.ipcRenderer.once('note-list-drawns-reply', (event, notes) => {
        //     this.notes = notes;
        // });

        // window.ipcRenderer.send('note-list-drawns');
    },
};
</script>
