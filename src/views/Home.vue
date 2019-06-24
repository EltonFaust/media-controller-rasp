<template>
    <div class="home">
        <b-container fluid class="actions">
            <b-row v-for="(group, gidx) of actionGroups" :key="gidx">
                <b-col xs="4" v-for="(item, iidx) of group" :key="iidx">
                    <router-link v-if="item !== null" :to="item.to" class="border rounded border-primary bg-primary text-white">
                        <div class="action-label">
                            <div class="item-icon"><i class="material-icons">{{ item.icon }}</i></div>
                            <div class="item-label">{{ item.label }}</div>
                        </div>
                    </router-link>
                </b-col>
            </b-row>
        </b-container>
        <b-container class="media-controls">
            <div class="play-container">
                <div class="play-action" @click="playPause">
                    <i class="icon material-icons">play_arrow</i>/<i class="icon material-icons">pause</i>
                </div>
            </div>
            <b-row>
                <b-col class="primary-actions">
                    <div class="actions-container">
                        <div class="volume-action"></div>
                        <div class="track-action" @click="prevTrack"><i class="material-icons">skip_previous</i></div>
                    </div>
                </b-col>
                <b-col class="secondary-actions">
                    <div class="actions-container">
                        <div class="track-action" @click="nextTrack"><i class="material-icons">skip_next</i></div>
                        <div class="volume-action"></div>
                    </div>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<style lang="scss">
    @import 'node_modules/bootstrap/scss/functions';
    @import 'node_modules/bootstrap/scss/variables';
    @import 'node_modules/bootstrap/scss/mixins';

    .home {
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;

        .actions {
            flex: 1;
            display: flex;
            flex-direction: column;

            .row {
                flex: 50%;
                margin-left: -10px;
                margin-right: -10px;

                .col {
                    padding: 5px;

                    a {
                        display: flex;
                        height: 100%;
                        align-items: center;
                        text-align: center;

                        .action-label {
                            flex: 1;

                            .item-icon {
                                font-size: 2rem;
                            }
                        }
                    }
                }
            }
        }

        .media-controls {
            position: relative;
            height: 60px;
            padding: 5px 0;

            * {
                height: 50px;
            }

            .play-container {
                position: absolute;
                width: 50px;
                left: 50%;
                margin-left: -25px;
                z-index: 2;

                .play-action {
                    text-align: center;
                    @include border-radius(25px);
                    border: 1px solid black;
                    font-size: 14px;
                    padding: 14px 0;

                    * {
                        height: auto;
                    }

                    .icon {
                        font-size: 20px !important;
                    }
                }
            }

            .row .col {
                .actions-container {
                    display: flex;

                    .volume-action {
                        flex: 1;
                    }

                    .track-action {
                        width: 80px;
                        padding: 10px 0;
                        font-size: 30px;
                        background-color: theme-color("primary");
                    }
                }

                &.primary-actions {
                    padding-right: 0;

                    .track-action {
                        padding-left: 15px;
                        text-align: left;
                        @include border-left-radius(20px);
                    }
                }

                &.secondary-actions {
                    padding-left: 0;

                    .track-action {
                        padding-right: 15px;
                        text-align: right;
                        @include border-right-radius(20px);
                    }
                }
            }
        }
    }
</style>

<script>
import 'material-design-icons-iconfont/dist/material-design-icons.css';
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue';
// import ipcRenderer from 'electron';

export default {
    name: 'home',
    data: () => (
        {
            actions: [
                { to: { name: 'note-drawn' }, label: 'Note', icon: 'note_add' },
                { to: { name: 'notes' }, label: 'Notes', icon: 'notes' },
                { to: { name: 'cameras' }, label: 'Cameras', icon: 'videocam' },
                null,
                null,
                null,
                // { to: { name: 'note-drawn' }, label: 'Note', icon: 'note_add' },
                // { to: { name: 'note-drawn' }, label: 'Note', icon: 'note_add' },
                // { to: { name: 'note-drawn' }, label: 'Note', icon: 'note_add' },
            ],
        }
    ),
    computed: {
        actionGroups() {
            const groups = [];

            this.actions.forEach((item, idx) => {
                if (idx % 3 === 0) {
                    groups.push([]);
                }

                groups[groups.length - 1].push(item);
            });

            return groups;
        },
    },
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
        // clk() {
        //     // window.test();
        //     // alert(window.ipcRenderer.sendSync('synchronous-message', 'ping'));

        //     // window.ipcRenderer.on('asynchronous-reply', (event, arg) => {
        //     //     alert(arg);
        //     // });

        //     // window.ipcRenderer.send('asynchronous-message', 'ping');
        // },
    },
};
</script>
