// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyload from 'vue-lazyload'
import {store} from './store/store'
import firebase from 'firebase'
Vue.use(VueLazyload)
Vue.config.productionTip = false

let app=null;

firebase.auth().onAuthStateChanged(()=>{
if(!app){
 app= new Vue({
    el: '#app',
    store,
    router,
    components: { App },
    template: '<App/>'
  })
}
})
/* eslint-disable no-new */
