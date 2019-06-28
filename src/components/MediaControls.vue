<template>
    <b-container class="media-controls">
        <div class="play-container">
            <div class="play-action" @click="playPause">
                <i class="icon material-icons">play_arrow</i>/<i class="icon material-icons">pause</i>
            </div>
        </div>
        <b-row>
            <b-col class="primary-actions">
                <div class="actions-container">
                    <div class="volume-action decrement-volume">
                        <div class="action-area" @click="decrementVolume">
                            <i class="material-icons">volume_down</i>
                        </div>
                    </div>
                    <div class="track-action" @click="prevTrack"><i class="material-icons">skip_previous</i></div>
                </div>
            </b-col>
            <b-col class="secondary-actions">
                <div class="actions-container">
                    <div class="track-action" @click="nextTrack"><i class="material-icons">skip_next</i></div>
                    <div class="volume-action increment-volume">
                        <div class="action-area" @click="incrementVolume">
                            <i class="material-icons">volume_up</i>
                        </div>
                    </div>
                </div>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
export default {
    name: 'MediaControls',
    // props: {
    //     msg: String,
    // },
    methods: {
        playPause() {
            window.ipcRenderer.send('audio-play-pause');
        },
        prevTrack() {
            window.ipcRenderer.send('audio-prev-track');
        },
        nextTrack() {
            window.ipcRenderer.send('audio-next-track');
        },
        decrementVolume() {
            window.ipcRenderer.send('audio-decrement-volume');
        },
        incrementVolume() {
            window.ipcRenderer.send('audio-increment-volume');
        },
    },
};
</script>

<style lang="scss" scoped>
    $base-height: 60px;
    $component-space: 5px;
    $internal-height: $base-height - ($component-space * 2);
    $icon-volume-size: 25px;
    $icon-track-size: 30px;
    $icon-play-size: 20px;

    .media-controls {
        position: relative;
        height: $base-height;
        padding: $component-space 0;

        .play-container {
            position: absolute;
            height: $internal-height;
            width: $internal-height;
            left: 50%;
            margin-left: -($internal-height / 2);
            z-index: 2;

            .play-action {
                text-align: center;
                @include border-radius($internal-height);
                border: 1px solid black;
                font-size: $icon-play-size * .7;
                // - 1px == border
                padding: ((($internal-height - $icon-play-size) / 2) - 1px) 0;

                .icon {
                    font-size: $icon-play-size !important;
                }
            }
        }

        .row .col {
            .actions-container {
                display: flex;
                height: $internal-height;

                .volume-action {
                    flex: 1;
                    padding: 0 $component-space;

                    &.decrement-volume {
                        text-align: right;
                    }

                    &.increment-volume {
                        text-align: left;
                    }

                    .action-area {
                        display: inline-block;
                        font-size: $icon-volume-size;
                        width: $internal-height;
                        text-align: center;

                        i {
                            line-height: $internal-height / $icon-volume-size * 1;
                        }
                    }
                }

                .track-action {
                    width: $internal-height + $icon-track-size;
                    padding: (($internal-height - $icon-track-size) / 2) 0;
                    font-size: $icon-track-size;
                    background-color: theme-color("primary");

                    i {
                        height: $icon-track-size;
                        vertical-align: initial;
                    }
                }
            }

            &.primary-actions {
                padding-right: 0;

                .track-action {
                    padding-left: $icon-track-size / 2;
                    text-align: left;
                    @include border-left-radius($internal-height - $icon-track-size);
                }
            }

            &.secondary-actions {
                padding-left: 0;

                .track-action {
                    padding-right: $icon-track-size / 2;
                    text-align: right;
                    @include border-right-radius($internal-height - $icon-track-size);
                }
            }
        }
    }
</style>
