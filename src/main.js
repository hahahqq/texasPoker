// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import store from "./store/index";
import axios from "axios";
import VueAxios from "vue-axios";
import Vuex from "vuex";
import VueRouter from "vue-router";
import routes from "./router/index";

import babelpolyfill from "babel-polyfill";
import ElementUI from "element-ui";
// import "element-ui/lib/theme-chalk/index.css";
import directive from "./directive";
import filter from "./filter";
// import VueQuillEditor from 'vue-quill-editor'
import VueCropper from "vue-cropper";

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(VueAxios, axios);
Vue.use(ElementUI);
Vue.use(babelpolyfill);
Vue.use(directive);
Vue.use(filter);
// Vue.use(VueQuillEditor)
Vue.use(VueCropper);

import { isPurViewFun } from "@/util/com/common.js";
Vue.prototype.isPurViewFun = isPurViewFun;

// Vue.config.debug = true;
Vue.config.productionTip = false;
axios.defaults.withCredentials = true; //让ajax携带cookie

import { getUserInfo } from "@/api/index";
const router = new VueRouter({ routes });

router.beforeEach((to, from, next) => {
   let user = getUserInfo();
   if (Object.keys(user).length == 0 && to.path != "/login") {
      next({ path: "/login" });
   } else {
      next();
   }
});

/* eslint-disable no-new */
const app = new Vue({
   el: "#app",
   store,
   render: h => h(App),
   template: "<App/>",
   components: { App },
   router
}).$mount("#app");
