<template>
    <div class="note-drawn">
        <b-container fluid class="drawning-area" id="note-drawning"></b-container>
        <b-container fluid class="drawn-options border-top border-secondary">
            <b-row>
                <b-col class="line-options d-flex text-center">
                    <div class="line-colors" style="flex: 1;display: flex;align-items: center;">
                        <div style="flex: 1;">
                            <div v-for="(colorItem, colorName) of colors"
                                style="padding: 0 2px; display: inline-block;vertical-align:middle;">
                                <div @click="selectColor(colorName)" style="height: 15px;width: 15px;"
                                    v-bind:style="{'background-color': `rgb(${colorItem.join(', ')})`}">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="line-size d-flex" style="align-items: center;">
                        <div @click="decrementSize" style="padding: 0 7px; font-size: 1.2rem;">-</div>
                        <div style="flex: 1;">{{ size }}px</div>
                        <div @click="incrementSize" style="padding: 0 7px; font-size: 1.2rem;">+</div>
                    </div>
                </b-col>
                <b-col class="d-flex text-right" style="align-items: center;">
                    <div style="flex: 1;">
                        <b-button @click="discardChanges" variant="warning" size="sm">
                            <!-- <i class="material-icons">save</i> -->
                            Discard
                        </b-button>&nbsp;
                        <b-button variant="success" size="sm">Save</b-button>
                    </div>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<style lang="scss">
    .note-drawn {
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
            padding-top: 5px;
            padding-bottom: 5px;

            .line-options {

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
            size: 5,
            color: 'light',
            colors: {
                light: [248, 249, 250],
                dark: [52, 58, 64],
                primary: [0, 123, 255],
                secondary: [108, 117, 125],
                success: [40, 167, 69],
                info: [23, 162, 184],
                warning: [255, 193, 7],
                danger: [220, 53, 69],
            },
        };
    },
    mounted() {
        const el = document.querySelector('.note-drawn .drawning-area');

        this.drawn = new CanvasFreeDrawing.default({
            elementId: 'note-drawning',
            width: el.offsetWidth,
            height: el.offsetHeight - 5,
        });

        this.drawn.setLineWidth(this.size);
        this.drawn.setBackground([0, 0, 0]);
        this.drawn.setStrokeColor(this.colors[this.color]);
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
        discardChanges () {
            window.history.length > 1
                ? this.$router.go(-1)
                : this.$router.push('/')
        },

        clk() {
            // window.test();
            alert(window.ipcRenderer.sendSync('synchronous-message', 'ping'));

            window.ipcRenderer.on('asynchronous-reply', (event, arg) => {
                alert(arg);
            });

            window.ipcRenderer.send('asynchronous-message', 'ping');
        },
    },
};
</script>
