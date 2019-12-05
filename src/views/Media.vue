<template>
    <div class="page-media">
        <nav-actions>
            <b-link :to="{ name: 'media-downloads' }" v-show="isConfigured" slot="central"><i class="material-icons">file_download</i> Downloads</b-link>
            <b-link @click="stopServer" v-show="isConfigured"><i class="material-icons">power_off</i> Close server</b-link>
        </nav-actions>

        <b-tabs justified v-if="isConfigured" v-on:input="selectMediaTab">
            <b-tab active>
                <template v-slot:title>
                    <b-spinner v-if="isLoadingMediaMovies" type="grow" small></b-spinner>
                    <i class="material-icons">local_movies</i>
                     Movies
                </template>
                <div>
                    <template v-if="hasMediaMovies">
                        <b-card v-for="movie of mediaMovies" :key="movie.key">
                            <b-media>
                                <template v-slot:aside>
                                    <b-img v-if="movie.thumb" :src="movie.thumb" width="64" heigth="94" alt="placeholder"></b-img>
                                    <b-img v-else blank blank-color="#ccc" width="64" heigth="94" alt="placeholder"></b-img>
                                </template>
                                <h5 class="mt-0 mb-0">{{ movie.title }}</h5>
                                <div class="mb-1" style="line-height: 1;"><small>Duration: {{ movie.duration | millistohuman }}</small></div>
                                <p class="mb-0">{{ movie.summary | strlimit(100) }}</p>
                            </b-media>
                        </b-card>
                    </template>
                    <div v-else style="margin-top: 100px;text-align: center;">
                        <b-link :to="{ name: 'media-downloads' }" class="btn btn-primary"><i class="material-icons">file_download</i> Downloads</b-link>
                    </div>
                </div>
            </b-tab>
            <b-tab>
                <template v-slot:title>
                    <b-spinner v-if="isLoadingMediaShows" type="grow" small></b-spinner>
                    <i class="material-icons">tv</i>
                    Shows
                </template>
                <div>
                    <template v-if="hasMediaShows">
                        <b-card v-for="show of mediaShows" :key="show.key">
                            <b-media>
                                <template v-slot:aside>
                                    <b-img v-if="show.thumb" :src="show.thumb" width="64" heigth="94" alt="placeholder"></b-img>
                                    <b-img v-else blank blank-color="#ccc" width="64" heigth="94" alt="placeholder"></b-img>
                                </template>
                                <h5 class="mt-0">{{ show.title }}</h5>
                                <p class="mb-0">{{ show.summary | strlimit(100) }}</p>
                            </b-media>
                        </b-card>
                    </template>
                    <div v-else style="margin-top: 100px;text-align: center;">
                        <b-link :to="{ name: 'media-downloads' }" class="btn btn-primary"><i class="material-icons">file_download</i> Downloads</b-link>
                    </div>
                </div>
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
        mediaMovies() {
            return this.$store.state.media.list.movies;
        },
        isLoadingMediaMovies() {
            return this.mediaMovies === false;
        },
        hasMediaMovies() {
            return this.mediaMovies && this.mediaMovies.length > 0;
        },
        mediaShows() {
            return this.$store.state.media.list.shows;
        },
        isLoadingMediaShows() {
            return this.mediaShows === false;
        },
        hasMediaShows() {
            return this.mediaShows && this.mediaShows.length > 0;
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
        selectMediaTab(tabIdx) {
            const mediaType = tabIdx === 0 ? 'movies' : 'shows';

            if (!this.$store.state.media.list[mediaType]) {
                this.waitLoadingFor(this.$store.dispatch(ACTIONS.FETCH_MEDIA_LIST, { mediaType }));
            }
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
