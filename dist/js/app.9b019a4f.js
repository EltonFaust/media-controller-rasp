(function(e){function n(n){for(var o,a,c=n[0],s=n[1],u=n[2],d=0,l=[];d<c.length;d++)a=c[d],r[a]&&l.push(r[a][0]),r[a]=0;for(o in s)Object.prototype.hasOwnProperty.call(s,o)&&(e[o]=s[o]);p&&p(n);while(l.length)l.shift()();return i.push.apply(i,u||[]),t()}function t(){for(var e,n=0;n<i.length;n++){for(var t=i[n],o=!0,a=1;a<t.length;a++){var c=t[a];0!==r[c]&&(o=!1)}o&&(i.splice(n--,1),e=s(s.s=t[0]))}return e}var o={},a={app:0},r={app:0},i=[];function c(e){return s.p+"js/"+({"component-media-controls":"component-media-controls","component-nav-actions":"component-nav-actions","page-cameras":"page-cameras","page-media":"page-media","page-note-drawn":"page-note-drawn","page-notes":"page-notes","page-settings":"page-settings"}[e]||e)+"."+{"component-media-controls":"0333d508","component-nav-actions":"1dd4782e","page-cameras":"2c31f05d","page-media":"e14e533a","page-note-drawn":"e491e898","page-notes":"5c40cb05","page-settings":"6fc4bf51"}[e]+".js"}function s(n){if(o[n])return o[n].exports;var t=o[n]={i:n,l:!1,exports:{}};return e[n].call(t.exports,t,t.exports,s),t.l=!0,t.exports}s.e=function(e){var n=[],t={"component-media-controls":1,"component-nav-actions":1,"page-cameras":1,"page-media":1,"page-note-drawn":1,"page-notes":1,"page-settings":1};a[e]?n.push(a[e]):0!==a[e]&&t[e]&&n.push(a[e]=new Promise(function(n,t){for(var o="css/"+({"component-media-controls":"component-media-controls","component-nav-actions":"component-nav-actions","page-cameras":"page-cameras","page-media":"page-media","page-note-drawn":"page-note-drawn","page-notes":"page-notes","page-settings":"page-settings"}[e]||e)+"."+{"component-media-controls":"c37fc500","component-nav-actions":"87c0cd1e","page-cameras":"0e433876","page-media":"af7bd106","page-note-drawn":"5f86ef3d","page-notes":"da6491d8","page-settings":"0e433876"}[e]+".css",r=s.p+o,i=document.getElementsByTagName("link"),c=0;c<i.length;c++){var u=i[c],d=u.getAttribute("data-href")||u.getAttribute("href");if("stylesheet"===u.rel&&(d===o||d===r))return n()}var l=document.getElementsByTagName("style");for(c=0;c<l.length;c++){u=l[c],d=u.getAttribute("data-href");if(d===o||d===r)return n()}var p=document.createElement("link");p.rel="stylesheet",p.type="text/css",p.onload=n,p.onerror=function(n){var o=n&&n.target&&n.target.src||r,i=new Error("Loading CSS chunk "+e+" failed.\n("+o+")");i.code="CSS_CHUNK_LOAD_FAILED",i.request=o,delete a[e],p.parentNode.removeChild(p),t(i)},p.href=r;var m=document.getElementsByTagName("head")[0];m.appendChild(p)}).then(function(){a[e]=0}));var o=r[e];if(0!==o)if(o)n.push(o[2]);else{var i=new Promise(function(n,t){o=r[e]=[n,t]});n.push(o[2]=i);var u,d=document.createElement("script");d.charset="utf-8",d.timeout=120,s.nc&&d.setAttribute("nonce",s.nc),d.src=c(e),u=function(n){d.onerror=d.onload=null,clearTimeout(l);var t=r[e];if(0!==t){if(t){var o=n&&("load"===n.type?"missing":n.type),a=n&&n.target&&n.target.src,i=new Error("Loading chunk "+e+" failed.\n("+o+": "+a+")");i.type=o,i.request=a,t[1](i)}r[e]=void 0}};var l=setTimeout(function(){u({type:"timeout",target:d})},12e4);d.onerror=d.onload=u,document.head.appendChild(d)}return Promise.all(n)},s.m=e,s.c=o,s.d=function(e,n,t){s.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},s.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,n){if(1&n&&(e=s(e)),8&n)return e;if(4&n&&"object"===typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(s.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var o in e)s.d(t,o,function(n){return e[n]}.bind(null,o));return t},s.n=function(e){var n=e&&e.__esModule?function(){return e["default"]}:function(){return e};return s.d(n,"a",n),n},s.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},s.p="",s.oe=function(e){throw console.error(e),e};var u=window["webpackJsonp"]=window["webpackJsonp"]||[],d=u.push.bind(u);u.push=n,u=u.slice();for(var l=0;l<u.length;l++)n(u[l]);var p=d;i.push([0,"chunk-vendors"]),t()})({0:function(e,n,t){e.exports=t("56d7")},"56d7":function(e,n,t){"use strict";t.r(n);t("a481"),t("ac6a"),t("5df3"),t("7f7f"),t("cadf"),t("551c"),t("f751"),t("097d");var o=t("31bd"),a=t("2b0e"),r=t("5f5b"),i=t("5b6c"),c=t.n(i),s=(t("d2db"),t("d1e7"),function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",{attrs:{id:"app"}},[t("router-view")],1)}),u=[],d={name:"app"},l=d,p=(t("5c0b"),t("2877")),m=Object(p["a"])(l,s,u,!1,null,null,null),f=m.exports,E=t("8c4f"),T=function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",{staticClass:"home"},[t("b-container",{staticClass:"actions",attrs:{fluid:""}},e._l(e.actionGroups,function(n,o){return t("b-row",{key:o},e._l(n,function(n,o){return t("b-col",{key:o,attrs:{xs:"4"}},[null!==n?t("router-link",{staticClass:"border rounded border-primary bg-primary text-white",attrs:{to:n.to}},[t("div",{staticClass:"action-label"},[t("div",{staticClass:"item-icon"},[t("i",{staticClass:"material-icons"},[e._v(e._s(n.icon))])]),t("div",{staticClass:"item-label"},[e._v(e._s(n.label))])])]):e._e()],1)}),1)}),1),t("div",{staticClass:"settings-button"},[t("router-link",{staticClass:"click-area",attrs:{tag:"div",to:{name:"settings"}}}),t("router-link",{staticClass:"click-button",attrs:{tag:"div",to:{name:"settings"}}},[t("i",{staticClass:"material-icons"},[e._v("settings")])])],1),t("media-controls"),t("div",{staticClass:"close-button"},[t("div",{staticClass:"click-area",on:{click:e.close}}),t("div",{staticClass:"click-button",on:{click:e.close}},[t("i",{staticClass:"material-icons"},[e._v("close")])])]),t("b-modal",{attrs:{id:"modal-close",title:"Close app"},on:{ok:e.confirmClose}},[t("p",{staticClass:"my-4"},[e._v("Do you want to close the app?")])])],1)},_=[],g=t("ac91"),v={name:"home",data:function(){return{actions:[{to:{name:"note-drawn"},label:"Note",icon:"note_add"},{to:{name:"notes"},label:"Notes",icon:"notes"},{to:{name:"cameras"},label:"Cameras",icon:"videocam"},{to:{name:"media"},label:"Media",icon:"ondemand_video"},null,null]}},computed:{actionGroups:function(){var e=[];return this.actions.forEach(function(n,t){t%3===0&&e.push([]),e[e.length-1].push(n)}),e}},methods:{close:function(){this.$bvModal.show("modal-close")},confirmClose:function(){window.close()}},asyncData:function(e){var n=e.store;return Promise.all([n.dispatch(g["a"].FETCH_SETTINGS),n.dispatch(g["a"].FETCH_HOME_ACTIONS)])}},h=v,b=(t("c78d"),Object(p["a"])(h,T,_,!1,null,"406504ad",null)),O=b.exports;a["default"].use(E["a"]);var w,N,S=new E["a"]({routes:[{path:"/",name:"home",component:O},{path:"/settings",name:"settings",component:function(){return t.e("page-settings").then(t.bind(null,"26d3"))}},{path:"/notes",name:"notes",component:function(){return t.e("page-notes").then(t.bind(null,"0841"))}},{path:"/notes/drawn",name:"note-drawn",component:function(){return t.e("page-note-drawn").then(t.bind(null,"9cf3"))}},{path:"/notes/drawn/:id",name:"note-edit-drawn",component:function(){return t.e("page-note-drawn").then(t.bind(null,"9cf3"))}},{path:"/cameras",name:"cameras",component:function(){return t.e("page-cameras").then(t.bind(null,"b64b"))}},{path:"/media",name:"media",component:function(){return t.e("page-media").then(t.bind(null,"89b1"))}}]}),A=t("2f62"),C=t("bd86"),y=(w={},Object(C["a"])(w,g["a"].FETCH_SETTINGS,function(e){var n=e.commit,t=e.state;return new Promise(function(e){t.isSettingsLoaded?e():(window.ipcRenderer.once("fetch-settings-reply",function(t,o){n(g["c"].SET_SETTINGS,o),n(g["c"].SET_SETTINGS,{}),e()}),window.ipcRenderer.send("fetch-settings"))})}),Object(C["a"])(w,g["a"].FETCH_HOME_ACTIONS,function(e){var n=e.commit;return new Promise(function(e){n(g["c"].SET_HOME_ACTIONS,{}),e()})}),Object(C["a"])(w,g["a"].FETCH_NOTES,function(e){var n=e.commit;return new Promise(function(e){window.ipcRenderer.once("note-list-drawns-reply",function(t,o){n(g["c"].SET_NOTES,o),e()}),window.ipcRenderer.send("note-list-drawns")})}),Object(C["a"])(w,g["a"].SAVE_NOTE,function(e,n){var t=n.id,o=n.content;return new Promise(function(e){window.ipcRenderer.once("note-drawn-save-reply",function(){e()}),window.ipcRenderer.send("note-drawn-save",{id:t,content:o})})}),Object(C["a"])(w,g["a"].DUPLICATE_NOTE,function(e,n){var t=e.commit;return new Promise(function(e){window.ipcRenderer.once("note-drawn-duplicate-reply",function(n,o){t(g["c"].ADD_NOTE,{note:o,mode:g["b"].PREPEND_DATA}),e()}),window.ipcRenderer.send("note-drawn-duplicate",n)})}),Object(C["a"])(w,g["a"].RENAME_NOTE,function(e,n){var t=e.commit,o=n.editId,a=n.newTitle;return new Promise(function(e){window.ipcRenderer.once("note-rename-reply",function(){t(g["c"].SET_NOTE_NAME,{editId:o,newTitle:a}),e()}),window.ipcRenderer.send("note-rename",{id:o,title:a})})}),Object(C["a"])(w,g["a"].REMOVE_NOTE,function(e,n){var t=e.commit;return new Promise(function(e){window.ipcRenderer.once("note-remove-reply",function(){t(g["c"].DELETE_NOTE,n),e()}),window.ipcRenderer.send("note-remove",n)})}),w),D=(t("20d6"),N={},Object(C["a"])(N,g["c"].SET_SETTINGS,function(e,n){a["default"].set(e.home,"minLines",n.home_min_lines)}),Object(C["a"])(N,g["c"].SET_HOME_ACTIONS,function(e,n){a["default"].set(e.home,"minLines",n.home_min_lines)}),Object(C["a"])(N,g["c"].SET_NOTES,function(e,n){e.notes=n}),Object(C["a"])(N,g["c"].ADD_NOTE,function(e,n){var t=n.note,o=n.mode;o===g["b"].PREPEND_DATA?e.notes.unshift(t):o===g["b"].APPEND_DATA&&e.notes.push(t)}),Object(C["a"])(N,g["c"].SET_NOTE_NAME,function(e,n){var t=n.editId,o=n.newTitle,r=e.notes.findIndex(function(e){var n=e.id;return n===t});-1!==r&&a["default"].set(e.notes[r],"title",o)}),Object(C["a"])(N,g["c"].DELETE_NOTE,function(e,n){var t=e.notes.findIndex(function(e){var t=e.id;return t===n});-1!==t&&a["default"].delete(e.notes,t)}),N),P={};a["default"].use(A["a"]);var M=new A["a"].Store({state:{isSettingsLoaded:!1,home:{minLines:2,itemsByLine:3,showMediaControls:!0,actions:[]},notes:[]},actions:y,mutations:D,getters:P});a["default"].component("media-controls",function(){return t.e("component-media-controls").then(t.bind(null,"6e9c"))}),a["default"].component("nav-actions",function(){return t.e("component-nav-actions").then(t.bind(null,"8fdf"))}),a["default"].mixin({beforeRouteUpdate:function(e,n,t){var o=this.$options.asyncData;o?o({store:this.$store,route:e}).then(t):t()}}),a["default"].config.productionTip=!1,a["default"].use(r["a"]),a["default"].use(c.a),Object(o["sync"])(M,S);var I=new a["default"]({router:S,store:M,render:function(e){return e(f)}});S.onReady(function(){S.beforeResolve(function(e,n,t){var o=S.getMatchedComponents(e),a=S.getMatchedComponents(n),r=!1,i=o.filter(function(t,o){return r||(r=a[o]!==t,!r&&t.forceFetchNoMatched&&(r=e.name!==n.name),r)}),c=i.map(function(e){return e.asyncData}).filter(function(e){return e});return c.length?(Promise.all(c.map(function(n){return n({store:M,route:e})})).then(t),!0):t()}),I.$mount("#app"),S.replace("#")})},"5c0b":function(e,n,t){"use strict";var o=t("5e27"),a=t.n(o);a.a},"5e27":function(e,n,t){},"73e9":function(e,n,t){},ac91:function(e,n,t){"use strict";t.d(n,"b",function(){return o}),t.d(n,"a",function(){return a}),t.d(n,"c",function(){return r});var o={REPLACE_DATA:"REPLACE_DATA",APPEND_DATA:"APPEND_DATA",PREPEND_DATA:"PREPEND_DATA"},a={FETCH_SETTINGS:"FETCH_SETTINGS",FETCH_HOME_ACTIONS:"FETCH_HOME_ACTIONS",UPDATE_HOME_CONFIG:"UPDATE_HOME_CONFIG",FETCH_NOTES:"FETCH_NOTES",SAVE_NOTE:"SAVE_NOTE",DUPLICATE_NOTE:"DUPLICATE_NOTE",RENAME_NOTE:"RENAME_NOTE",REMOVE_NOTE:"REMOVE_NOTE"},r={SET_SETTINGS:"SET_SETTINGS",SET_HOME_ACTIONS:"SET_HOME_ACTIONS",SET_NOTES:"SET_NOTES",ADD_NOTE:"ADD_NOTE",SET_NOTE_NAME:"SET_NOTE_NAME",DELETE_NOTE:"DELETE_NOTE"}},c78d:function(e,n,t){"use strict";var o=t("73e9"),a=t.n(o);a.a}});
//# sourceMappingURL=app.9b019a4f.js.map