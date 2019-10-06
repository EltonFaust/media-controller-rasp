<template>
    <div class="media">
        <nav-actions></nav-actions>
    </div>
</template>

<style lang="scss" scoped>
    .media {
    }
</style>

<script>
export default {
    name: 'media',
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
