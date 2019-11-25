<template>
    <div class="page-media">
        <nav-actions>
            <b-link :to="{ name: 'media-downloads' }" v-show="isConfigured" slot="central"><i class="material-icons">file_download</i> Downloads</b-link>
            <b-link @click="stopServer" v-show="isConfigured"><i class="material-icons">power_off</i> Close server</b-link>
        </nav-actions>

        <b-tabs justified v-if="isConfigured">
            <b-tab active>
                <template v-slot:title>
                    <!-- <b-spinner type="grow" small></b-spinner> -->
                    <i class="material-icons">local_movies</i>
                     Movies
                </template>
                <div>
                    <b-card>
                        <b-media>
                            <template v-slot:aside>
                                <!-- <b-img src="http://127.0.0.1:32400/library/metadata/545/thumb/1573528519?X-Plex-Token=" width="64" alt="placeholder"></b-img> -->
                                <b-img blank blank-color="#ccc" width="64" alt="placeholder"></b-img>
                            </template>
                            <h5 class="mt-0">Media Title</h5>
                            <p class="mb-0">
                                Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin.
                                Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc
                                ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                            </p>
                        </b-media>
                    </b-card>
                    <b-card>
                        <b-media>
                            <template v-slot:aside>
                                <b-img blank blank-color="#ccc" width="64" alt="placeholder"></b-img>
                            </template>
                            <h5 class="mt-0">Media Title</h5>
                            <p class="mb-0">
                                Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin.
                                Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc
                                ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                            </p>
                        </b-media>
                    </b-card>
                </div>
            </b-tab>
            <b-tab>
                <template v-slot:title>
                    <!-- <b-spinner type="grow" small></b-spinner> -->
                    <i class="material-icons">tv</i>
                    Shows
                </template>
                <p>I'm the second tab</p>
            </b-tab>
        </b-tabs>
        <center-content v-else>
            <b-container>
                <template v-if="$store.state.media.serverAddress.length">
                    <b-row>
                        <b-col>Access on any device to configure you media server</b-col>
                    </b-row>
                    <b-row class="mt-3">
                        <b-col><img :src="qrCodeSrc"/></b-col>
                    </b-row>
                    <b-row class="mt-3" v-for="address of $store.state.media.serverAddress" :key="address">
                        <b-col>
                            {{ address }}/configure
                            <i class="material-icons" v-if="qrCodeFor != address" @click="createQrCodeFor(address)">add_to_home_screen</i>
                        </b-col>
                    </b-row>
                </template>
                <template v-else>
                    <b-row><b-col>To configure and control your medias, is required to star a local server.</b-col></b-row>
                    <b-row class="mt-3">
                        <b-col>
                            <b-button variant="primary" @click="startServer">Start server</b-button>
                        </b-col>
                    </b-row>
                </template>
            </b-container>
        </center-content>
    </div>
</template>

<style lang="scss" scoped>
    .page-media {
        height: 100%;
        display: flex;
        flex-direction: column;

        .center-content {
            flex: 1;
        }
    }
</style>

<script>
import * as QRCode from 'qrcode';
// import * as PlexAPI from 'plex-api';
import { ACTIONS } from '@/store/_types';

export default {
    name: 'media',
    data() {
        return {
            qrCodeSrc: null,
            qrCodeFor: null,
        };
    },
    computed: {
        isConfigured() {
            return this.$store.state.media.serverAddress.length && this.$store.state.media.isConfigured;
        },
    },
    methods: {
        startServer() {
            this.waitLoadingFor(
                this.$store.dispatch(ACTIONS.START_MEDIA_SERVER).then(() => {
                    if (!this.$store.state.media.isConfigured) {
                        const address = this.$store.state.media.serverAddress[0];

                        if (address) {
                            this.createQrCodeFor(address);
                        }

                        this.$store.dispatch(ACTIONS.WAIT_MEDIA_CONFIGURE);
                    }
                }),
            );
        },
        stopServer() {
            this.qrCodeFor = null;
            this.qrCodeSrc = null;

            this.waitLoadingFor(this.$store.dispatch(ACTIONS.STOP_MEDIA_SERVER));
        },
        createQrCodeFor(address) {
            this.qrCodeFor = address;

            QRCode.toDataURL(`${address}/configure`, { errorCorrectionLevel: 'H', width: 180 }, (err, url) => {
                this.qrCodeSrc = url;
            });
        },
    },
    mounted() {
        if (!this.$store.state.media.isConfigured) {
            const address = this.$store.state.media.serverAddress[0];

            if (address) {
                this.createQrCodeFor(address);
            }
        }
    },
};
</script>
