import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.prototype.loading = false;

Vue.prototype.$UPS_APPID="vMMcWqjwiIWDuS8n3Mg6Mt2Wzj9t0U7celxYCTMmvVHfHXBr";
Vue.prototype.$UPS_APPSECRET = "msWuqdWTkAEI8RVxmBfxzjVAlGNAySbsIVMokpochWm95JU9uVG43q1jCskuAfm5";

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
