<template>
    <div class="notes">
        <b-container>
            <b-row>
                <b-col class="text-left"><b-link :to="{ name: 'home' }" class="text-white"><i class="material-icons">arrow_back</i> Home</b-link></b-col>
                <b-col class="text-right"><b-link :to="{ name: 'note-drawn' }" class="text-white"><i class="material-icons">note_add</i> Add</b-link></b-col>
            </b-row>
        </b-container>
        <div class="card-columns">
            <b-card v-for="note of notes" :key="note.id" :title="editingId != note.id ? note.title : ''" :img-src="`../data/note/${note.path}?_t=${note.updated}_`" :ref="`card-${note.id}`" img-alt="Note" img-top tag="article" class="text-white bg-secondary text-center">
                <b-card-text  v-if="editingId == note.id">
                    <b-form-group label="Enter a new title" label-for="new-title" :invalid-feedback="invalidFeedback" :state="state">
                        <b-form-input v-model="newTitle" :state="state" trim></b-form-input>
                    </b-form-group>
                </b-card-text>

                <b-link v-if="!editingId" @click="edit(note.id)" href="#" class="text-white card-link">Change title</b-link>
                <b-link v-if="!editingId" :to="{ name: 'note-edit-drawn', params: { id: note.id } }" class="text-white card-link">Edit note</b-link>
                <b-link v-if="editingId == note.id" @click="save" href="#" class="text-white card-link">Save</b-link>
                <b-link v-if="editingId == note.id" @click="cancel" href="#" class="text-white card-link">Cancel</b-link>
            </b-card>
        </div>

        <div class="simple-keyboard"></div>
        <div v-if="editingId" class="simple-keyboard-holder"></div>
    </div>
</template>

<style lang="scss">
    .notes {
        padding: 5px 5px 0 5px;

        .card .card-body .card-title {
            font-size: 1.1rem;
        }

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
                height: 25px;
            }
        }

        .simple-keyboard-holder {
            height: 125px;
        }
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
            keyboardInstace: null,
        };
    },
    computed: {
        state() {
            return this.newTitle.length >= 4;
        },
        invalidFeedback() {
            if (this.newTitle.length > 4) {
                return '';
            }

            if (this.newTitle.length > 0) {
                return 'Enter at least 4 characters';
            }

            return 'Please enter something';
        },
    },
    methods: {
        edit(id) {
            this.notes.some((note) => {
                if (id === note.id) {
                    this.newTitle = note.title;
                    return true;
                }

                return false;
            });

            this.editingId = id;

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
                window.scrollTo(0, this.$refs[`card-${id}`][0].offsetTop - 5);
            });
        },
        save() {
            window.ipcRenderer.once('note-rename-reply', (event, newTitle) => {
                this.notes.find(n => n.id === this.editingId).title = newTitle;
                console.log(this.notes.find(n => n.id === this.editingId));
                // this.notes[this.notes.find(n => n.id === this.editingId)].title = newTitle;
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
    },
    mounted() {
        window.ipcRenderer.once('note-list-drawns-reply', (event, notes) => {
            this.notes = notes;
        });

        window.ipcRenderer.send('note-list-drawns');
    },
};
</script>
