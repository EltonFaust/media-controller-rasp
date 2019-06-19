<template>
    <div class="notes">
        <!-- <b-container>

        </b-container>
        <b-col>

        </b-col> -->
        <div class="note" v-for="note of notes" :key="note.id">
            <b-card
                :title="note.title"
                :img-src="`../data/note/${note.path}`"
                img-alt="Image"
                img-top
                tag="article">
            <!-- <b-card-text>
            Some quick example text to build on the card title and make up the bulk of the card's content.
            </b-card-text> -->

            <!-- <b-button href="#" variant="primary">Go somewhere</b-button> -->
            </b-card>
        </div>
    </div>
</template>

<style lang="scss">
    .notes {
        padding: 0 5px;
        .note {
            display: inline-block;
            width: 50%;
            padding: 0 5px 5px 5px;
        }
    }
</style>

<script>
export default {
    name: 'notes',
    data() {
        return {
            notes: [],
        };
    },
    mounted() {
        window.ipcRenderer.once('list-drawns-reply', (event, notes) => {
            this.notes = notes;
        });

        window.ipcRenderer.send('list-drawns');
    },
};
</script>
