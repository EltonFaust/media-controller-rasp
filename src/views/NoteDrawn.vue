<template>
    <div class="note-drawn">
        <div class="drawning-area" id="note-drawning"></div>
        <!-- <b-container fluid class="drawning-area" id="note-drawning"></b-container> -->
        <b-container fluid class="drawn-options border-top border-secondary">
            <div class="line-options text-center">
                <div class="line-colors">
                    <div class="colors-container">
                        <div v-for="(colorItem, colorName) of colors" :key="colorName" class="color-item"
                            v-bind:class="{'color-selected': colorName == color}">
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

<style lang="scss" scoped>
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
                            border: 2px solid transparent;
                            display: inline-block;
                            vertical-align: middle;

                            &.color-selected {
                                border-color: rgb(140, 255, 210);
                            }

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
import { ACTIONS } from '@/store/_types';

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

        const drawnWidth = el.offsetWidth;
        const drawnHeight = el.offsetHeight - 5;

        // eslint-disable-next-line new-cap
        this.drawn = new CanvasFreeDrawing.default({
            elementId: 'note-drawning',
            width: drawnWidth,
            height: drawnHeight,
            backgroundColor: [0, 0, 0],
            lineWidth: this.size,
            strokeColor: this.colors[this.color],
        });

        const { id } = this.$route.params;

        if (id) {
            window.ipcRenderer.once('note-get-reply', (event, note) => {
                // resize a canvas element
                // https://stackoverflow.com/a/53986239/3337038
                let finalContent = note.content;

                let width = drawnWidth;
                let height = drawnHeight;

                const img = new Image();
                img.src = finalContent;

                img.onload = () => {
                    // Check if the image require resize at all
                    if (img.height > height || img.width > width) {
                        // Make sure the width and height preserve the original aspect ratio and adjust if needed
                        if (img.height > img.width) {
                            width = Math.floor(height * (img.width / img.height));
                        } else {
                            height = Math.floor(width * (img.height / img.width));
                        }

                        const resizingCanvas = document.createElement('canvas');
                        const resizingCanvasContext = resizingCanvas.getContext('2d');

                        // Start with original image size
                        resizingCanvas.width = img.width;
                        resizingCanvas.height = img.height;

                        // Draw the original image on the (temp) resizing canvas
                        resizingCanvasContext.drawImage(img, 0, 0, resizingCanvas.width, resizingCanvas.height);

                        const curImageDimensions = {
                            width: Math.floor(img.width),
                            height: Math.floor(img.height),
                        };

                        const halfImageDimensions = {
                            width: null,
                            height: null,
                        };

                        // Quickly reduce the dize by 50% each time in few iterations until the size is less then
                        // 2x time the target size - the motivation for it, is to reduce the aliasing that would have been
                        // created with direct reduction of very big image to small image
                        while (curImageDimensions.width * 0.5 > width) {
                            // Reduce the resizing canvas by half and refresh the image
                            halfImageDimensions.width = Math.floor(curImageDimensions.width * 0.5);
                            halfImageDimensions.height = Math.floor(curImageDimensions.height * 0.5);

                            resizingCanvasContext.drawImage(resizingCanvas, 0, 0, curImageDimensions.width, curImageDimensions.height, 0, 0, halfImageDimensions.width, halfImageDimensions.height);

                            curImageDimensions.width = halfImageDimensions.width;
                            curImageDimensions.height = halfImageDimensions.height;
                        }

                        // Now do final resize for the resizingCanvas to meet the dimension requirments
                        // directly to the output canvas, that will output the final image
                        const outputCanvas = document.createElement('canvas');
                        const outputCanvasContext = outputCanvas.getContext('2d');

                        outputCanvas.width = width;
                        outputCanvas.height = height;

                        outputCanvasContext.drawImage(resizingCanvas, 0, 0, curImageDimensions.width, curImageDimensions.height, 0, 0, width, height);

                        finalContent = outputCanvas.toDataURL();
                    }

                    this.drawn.restore(finalContent, () => {
                        this.drawn.snapshots = [];
                        this.drawn.undos = [];
                        this.drawn.storeSnapshot();
                    });
                };
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
            this.buttonBlock = true;

            this.$store.dispatch(ACTIONS.SAVE_NOTE, { id: this.$route.params.id, content: this.drawn.save() }).then(() => {
                this.discardChanges();
            });
        },
    },
};
</script>
