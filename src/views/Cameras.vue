<template>
    <div class="cameras" scoped>
        <b-container>
            <b-row>
                <b-col class="text-left"><b-link :to="{ name: 'home' }" class="text-white"><i class="material-icons">arrow_back</i> Home</b-link></b-col>
                <!-- <b-col class="text-right"><b-link :to="{ name: 'note-drawn' }" class="text-white"><i class="material-icons">note_add</i> Add</b-link></b-col> -->
            </b-row>
        </b-container>
    </div>
</template>

<style lang="scss">
    .cameras {
    }
</style>

<script>
export default {
    name: 'cameras',
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
