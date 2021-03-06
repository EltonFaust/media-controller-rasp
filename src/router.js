import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
        },
        {
            path: '/settings',
            name: 'settings',
            component: () => import(/* webpackChunkName: "page-settings" */ './views/Settings.vue'),
        },
        {
            path: '/notes',
            name: 'notes',
            component: () => import(/* webpackChunkName: "page-notes" */ './views/Notes.vue'),
        },
        {
            path: '/notes/drawn',
            name: 'note-drawn',
            component: () => import(/* webpackChunkName: "page-note-drawn" */ './views/NoteDrawn.vue'),
        },
        {
            path: '/notes/drawn/:id',
            name: 'note-edit-drawn',
            component: () => import(/* webpackChunkName: "page-note-drawn" */ './views/NoteDrawn.vue'),
        },
        {
            path: '/cameras',
            name: 'cameras',
            component: () => import(/* webpackChunkName: "page-cameras" */ './views/Cameras.vue'),
        },
        {
            path: '/media',
            name: 'media',
            component: () => import(/* webpackChunkName: "page-media" */ './views/Media.vue'),
        },
        {
            path: '/media-downloads',
            name: 'media-downloads',
            component: () => import(/* webpackChunkName: "page-media-downloads" */ './views/MediaDownloads.vue'),
        },
        // {
        //     path: '/note-drawn',
        //     name: 'note-drawn',
        //     // route level code-splitting
        //     // this generates a separate chunk (about.[hash].js) for this route
        //     // which is lazy-loaded when the route is visited.
        //     component: () => import(/* webpackChunkName: "note-drawn" */ './views/NoteDrawn.vue'),
        // },
    ],
});
