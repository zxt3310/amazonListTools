import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import MyNavi from "./components/Navi.vue";
import EchoInstance from "./js/bootstrap.js";


Vue.prototype.$echo = EchoInstance;
Vue.config.silent = true; // 关闭所有Vue日志和警告（生产环境默认启用）
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.prototype.loading = false;
Vue.component('MyNavi', MyNavi)

Vue.prototype.$UPS_APPID = "vMMcWqjwiIWDuS8n3Mg6Mt2Wzj9t0U7celxYCTMmvVHfHXBr";
Vue.prototype.$UPS_APPSECRET = "msWuqdWTkAEI8RVxmBfxzjVAlGNAySbsIVMokpochWm95JU9uVG43q1jCskuAfm5";

store.dispatch('fetchUserInfo').then((e)=>{
	new Vue({
		router,
		store,
		render: h => h(App)
	}).$mount("#app");
}).catch((e)=>{
	new Vue({
		router,
		store,
		render: h => h(App)
	}).$mount("#app");
})

