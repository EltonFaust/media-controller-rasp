<template>
    <div class="note-drawn">
        <div class="drawning-area" id="note-drawning"></div>
        <!-- <b-container fluid class="drawning-area" id="note-drawning"></b-container> -->
        <b-container fluid class="drawn-options border-top border-secondary">
            <div class="line-options text-center">
                <div class="line-colors">
                    <div class="colors-container">
                        <div v-for="(colorItem, colorName) of colors" :key="colorName" class="color-item">
                            <div @click="selectColor(colorName)" class="color-select"
                                v-bind:style="{'background-color': `rgb(${colorItem.join(', ')})`}">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="line-size d-flex">
                    <div @click="decrementSize" class="size-ajust">-</div>
                    <div class="size-value">{{ size }}px</div>
                    <div @click="incrementSize" class="size-ajust">+</div>
                </div>
            </div>
            <div class="actions text-right">
                <div style="flex: 1;">
                    <b-button @click="undo" :disable="buttonBlock" variant="light" size="sm">
                        <i class="material-icons">undo</i>
                    </b-button>
                    &nbsp;
                    <b-button @click="discardChanges" :disable="buttonBlock" variant="warning" size="sm">
                        Discard
                    </b-button>
                    &nbsp;
                    <b-button @click="save" :disable="buttonBlock" variant="success" size="sm">Save</b-button>
                </div>
            </div>
        </b-container>
    </div>
</template>

<style lang="scss">
    @import '~bootstrap/scss/functions';
    @import '~bootstrap/scss/variables';
    @import '~bootstrap/scss/mixins';

    .note-drawn {
        overflow: hidden;
        display: flex;
        flex-direction: column;
        height: 100%;

        .drawning-area {
            flex: 1;

            canvas {
                width: 100%;
                height: 100%;
            }
        }

        .drawn-options {
            display: flex;
            padding: 5px 0;
            margin: 0 -($grid-gutter-width / 2)px;

            .line-options {
                padding: 0 ($grid-gutter-width / 2);
                display: flex;
                flex: 1;

                .line-colors {
                    flex: 1;
                    display: flex;
                    align-items: center;

                    .colors-container {
                        flex: 1;

                        .color-item {
                            padding: 0 2px;
                            display: inline-block;
                            vertical-align: middle;

                            .color-select {
                                height: 20px;
                                width: 20px;
                            }
                        }
                    }
                }

                .line-size {
                    align-items: center;

                    .size-ajust {
                        padding: 0 7px;
                        font-size: 1.2rem;
                    }

                    .size-value {
                        flex: 1;
                        width: 35px;
                    }
                }
            }
            .actions {
                padding: 0 ($grid-gutter-width / 2);
                align-items: center;
            }
        }
    }
</style>

<script>
import * as CanvasFreeDrawing from 'canvas-free-drawing';

export default {
    name: 'note-drawn',
    data() {
        return {
            drawn: null,
            size: 3,
            color: 'light',
            colors: {
                light: [248, 249, 250],
                primary: [0, 123, 255],
                secondary: [108, 117, 125],
                success: [40, 167, 69],
                warning: [255, 193, 7],
                danger: [220, 53, 69],
            },
            buttonBlock: false,
        };
    },
    mounted() {
        const el = document.querySelector('.note-drawn .drawning-area');

        this.drawn = new CanvasFreeDrawing.default({
            elementId: 'note-drawning',
            width: el.offsetWidth,
            height: el.offsetHeight - 5,
            backgroundColor: [0, 0, 0],
            lineWidth: this.size,
            strokeColor: this.colors[this.color],
        });

        const { id } = this.$route.params;

        if (id) {
            window.ipcRenderer.once('note-get-reply', (event, note) => {
                this.drawn.restore(note.content, () => {
                    this.drawn.storeSnapshot();
                    this.drawn.snapshots.splice(0, 1);
                });
            });

            window.ipcRenderer.send('note-get', id);
        }
    },
    methods: {
        selectColor(colorName) {
            this.color = colorName;
            this.drawn.setStrokeColor(this.colors[this.color]);
        },
        incrementSize() {
            this.size = this.size + 1;
            this.drawn.setLineWidth(this.size);
        },
        decrementSize() {
            if (this.size > 1) {
                this.size = this.size - 1;
                this.drawn.setLineWidth(this.size);
            }
        },
        undo() {
            this.drawn.undo();
        },
        discardChanges() {
            if (window.history.length > 1) {
                this.$router.go(-1);
            } else {
                this.$router.push('/');
            }
        },
        save() {
            // window.test();
            // console.log(window.ipcRenderer.sendSync('synchronous-message', 'ping'));

            // window.ipcRenderer.on('drawn-save-reply', (event, arg) => {
            //     this.discardChanges();
            // });

            this.buttonBlock = true;

            window.ipcRenderer.once('note-drawn-save-reply', () => {
                this.discardChanges();
            });

            window.ipcRenderer.send('note-drawn-save', { id: this.$route.params.id, content: this.drawn.save() });
        },
    },
};
</script>
