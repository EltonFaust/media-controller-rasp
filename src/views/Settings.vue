<template>
    <div class="settings">
        <nav-actions></nav-actions>

        <div>
            <pre>{{ storeData }}</pre>
        </div>
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
    computed: {
        storeData() {
            return JSON.stringify(this.$store.state, null, 4);
        },
    },
};
</script>
