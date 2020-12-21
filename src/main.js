import Vue from "vue";
import App from "./App.vue";
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import VueRouter from "vue-router"
import router from "./router"

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import "./scss/variables.scss"

Vue.use(BootstrapVue);
Vue.use(VueRouter);
Vue.use(BootstrapVueIcons);
Vue.config.productionTip = false;

//Root instance
new Vue({
  router, //this variable must be nothing but "router"
  render: h => h(App)
}).$mount("#app");
