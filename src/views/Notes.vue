<template>
    <div class="notes">
        <nav-actions>
            <b-link :to="{ name: 'note-drawn' }"><i class="material-icons">note_add</i> Add</b-link>
        </nav-actions>
        <div class="card-columns">
            <b-card v-for="note of notes" :key="note.id" :title="editingId != note.id ? note.title : ''" :img-src="`../data/note/${note.path}?_t=${note.updated}_`" :ref="`card-${note.id}`" img-alt="Note" img-top tag="article" class="text-white bg-secondary text-center">
                <b-card-text  v-if="editingId == note.id">
                    <b-form-group label="Enter a new title" label-for="new-title" :invalid-feedback="renameInvalidFeedback" :state="renameState">
                        <b-form-input v-model="newTitle" :state="renameState" trim></b-form-input>
                    </b-form-group>
                </b-card-text>

                <b-button variant="danger" size="sm" class="remove-note" @click="openModalForRemove(note.id)">
                    <i class="material-icons">highlight_remove</i>
                </b-button>

                <b-link v-if="!editingId" @click="edit(note.id)" href="#" class="text-white card-link">Change title</b-link>
                <b-link v-if="!editingId" :to="{ name: 'note-edit-drawn', params: { id: note.id } }" class="text-white card-link">Edit note</b-link>
                <b-link v-if="editingId == note.id" @click="save" :disabled="!renameState" href="#" class="text-white card-link">Save</b-link>
                <b-link v-if="editingId == note.id" @click="cancel" href="#" class="text-white card-link">Cancel</b-link>
            </b-card>
        </div>

        <div class="simple-keyboard"></div>
        <div v-if="editingId" class="simple-keyboard-holder"></div>

        <b-modal id="modal-remove-note" title="Remove note" @ok="remove">
            <p class="my-4">Confirm remove note "<b>{{ removingNote ? removingNote.title : '' }}</b>"?</p>
        </b-modal>
    </div>
</template>

<style lang="scss" scoped>
    .notes .card-columns {
        padding: 0 5px 0 5px;

        .card .card-body {
             .card-title {
                font-size: 1.1rem;
            }

            .remove-note {
                position: absolute;
                right: 10px;
                top: 10px;
                font-size: 25px;
                padding: 0.2rem;
                line-height: 1;
            }
        }
    }
</style>

<style lang="scss">
    .simple-keyboard {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: black;
        color: black;

        &.hg-layout-default,
        &.hg-layout-shift {
            .hg-button-numbers,
            .hg-button-cancel {
                flex-grow: .3;
            }
        }

        .hg-button {
            height: 25px !important;
        }
    }

    .simple-keyboard-holder {
        height: 125px;
    }
</style>

<script>
import Keyboard from 'simple-keyboard';

export default {
    name: 'notes',
    data() {
        return {
            notes: [],
            newTitle: '',
            editingId: null,
            removingId: null,
            keyboardInstace: null,
        };
    },
    computed: {
        renameState() {
            return this.newTitle.length >= 4;
        },
        renameInvalidFeedback() {
            if (this.newTitle.length >= 4) {
                return '';
            }

            if (this.newTitle.length > 0) {
                return 'Enter at least 4 characters';
            }

            return 'Please enter something';
        },
        removingNote() {
            let removingNote = null;

            this.notes.some((note) => {
                if (this.removingId === note.id) {
                    removingNote = note;
                    return true;
                }

                return false;
            });


            return removingNote;
        },
    },
    methods: {
        edit(noteId) {
            this.editingId = noteId;
            this.newTitle = this.notes.find(({ id }) => id === this.editingId).title;

            this.keyboardInstace = new Keyboard({
                onChange: (input) => {
                    this.newTitle = input;
                },
                onKeyPress: (button) => {
                    if (button === '{shift}' || button === '{lock}') {
                        const currentLayout = this.keyboardInstace.options.layoutName;
                        const shiftToggle = currentLayout === 'default' ? 'shift' : 'default';

                        this.keyboardInstace.setOptions({
                            layoutName: shiftToggle,
                        });
                    }

                    if (button === '{numbers}' || button === '{abc}') {
                        const currentLayout = this.keyboardInstace.options.layoutName;
                        const numbersToggle = currentLayout !== 'numbers' ? 'numbers' : 'default';

                        this.keyboardInstace.setOptions({
                            layoutName: numbersToggle,
                        });
                    }

                    if (button === '{cancel}') {
                        this.cancel();
                    }
                },
                mergeDisplay: true,
                layoutName: 'default',
                layout: {
                    default: [
                        'q w e r t y u i o p',
                        'a s d f g h j k l',
                        '{shift} z x c v b n m {backspace}',
                        '{numbers} {space} {cancel}',
                    ],
                    shift: [
                        'Q W E R T Y U I O P',
                        'A S D F G H J K L',
                        '{shift} Z X C V B N M {backspace}',
                        '{numbers} {space} {cancel}',
                    ],
                    numbers: [
                        '1 2 3',
                        '4 5 6',
                        '7 8 9',
                        '{abc} 0 {backspace}',
                    ],
                },
                display: {
                    '{numbers}': '123',
                    '{ent}': 'return',
                    '{escape}': 'esc ⎋',
                    '{tab}': 'tab ⇥',
                    '{backspace}': '⌫',
                    '{capslock}': 'caps lock ⇪',
                    '{shift}': '⇧',
                    '{controlleft}': 'ctrl ⌃',
                    '{controlright}': 'ctrl ⌃',
                    '{altleft}': 'alt ⌥',
                    '{altright}': 'alt ⌥',
                    '{metaleft}': 'cmd ⌘',
                    '{metaright}': 'cmd ⌘',
                    '{abc}': 'ABC',
                    '{cancel}': '<i class="material-icons">close</i>',
                },
            });

            this.keyboardInstace.setInput(this.newTitle);

            this.$nextTick(() => {
                const cardEl = this.$refs[`card-${this.editingId}`][0];
                const cardBodyEl = cardEl.querySelector('.card-body');

                window.scrollTo(0, (cardEl.offsetTop + cardBodyEl.offsetTop) - 5);
            });
        },
        save() {
            window.ipcRenderer.once('note-rename-reply', (event, newTitle) => {
                const editIdx = this.notes.findIndex(({ id }) => id === this.editingId);

                if (editIdx !== -1) {
                    this.$set(this.notes[editIdx], 'title', newTitle);
                }

                this.cancel();
            });

            window.ipcRenderer.send('note-rename', { id: this.editingId, title: this.newTitle });
        },
        cancel() {
            this.keyboardInstace.destroy();
            this.keyboardInstace = null;
            this.editingId = null;
            this.newTitle = '';
        },
        openModalForRemove(noteId) {
            this.removingId = noteId;
            this.$bvModal.show('modal-remove-note');
        },
        remove(event) {
            event.preventDefault();

            window.ipcRenderer.once('note-remove-reply', () => {
                const rmIdx = this.notes.findIndex(({ id }) => id === this.removingId);

                if (rmIdx !== -1) {
                    this.$delete(this.notes, rmIdx);
                }

                this.$bvModal.hide('modal-remove-note');
            });

            window.ipcRenderer.send('note-remove', this.removingId);
        },
    },
    mounted() {
        window.ipcRenderer.once('note-list-drawns-reply', (event, notes) => {
            this.notes = notes;
        });

        window.ipcRenderer.send('note-list-drawns');
    },
};
</script>
