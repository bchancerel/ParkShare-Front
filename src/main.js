import 'mdb-vue-ui-kit/css/mdb.min.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import JQuery from 'jquery'
import * as bootstrap from 'bootstrap';
import VueGoogleMaps from '@fawmi/vue-google-maps';



const $ = JQuery
window.JQuery = $

createApp(App).use(store).use(router).use(bootstrap).use(VueGoogleMaps, {
    load: {
        key: 'AIzaSyC6qEEIsPJorhxpScN0sSKHBQ1cR1NBc18',
    },
}).mount('#app')
