import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/global-optimization.css';
import MyNavi from "./components/Navi.vue";
import EchoInstance from "./js/bootstrap.js";
// import VueIziToast from 'vue-izitoast';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

iziToast.settings({
  position: 'topRight',
  timeout: 5000,
  resetOnHover: true,
  progressBar: true,
  transitionIn: 'fadeInLeft',
  transitionOut: 'fadeOutRight',
  displayMode: 0,
  layout:2,
  pauseOnHover:true
});

// // 默认配置（可选）
// const options = {
//   position: 'topRight',
//   timeout: 5000,
//   progressBar: true,
//   transitionIn: 'fadeInUp',
// };
// Vue.use(VueIziToast, options);

Vue.prototype.$echo = EchoInstance;
Vue.prototype.$iziToast = iziToast;
Vue.config.silent = true; // 关闭所有Vue日志和警告（生产环境默认启用）
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.prototype.loading = false;
Vue.component('MyNavi', MyNavi)

Vue.prototype.$UPS_APPID = "vMMcWqjwiIWDuS8n3Mg6Mt2Wzj9t0U7celxYCTMmvVHfHXBr";
Vue.prototype.$UPS_APPSECRET = "msWuqdWTkAEI8RVxmBfxzjVAlGNAySbsIVMokpochWm95JU9uVG43q1jCskuAfm5";

// 在 Vue 实例中添加自定义指令
Vue.directive('enable', {
  inserted: function (el, binding) {
    if (binding.value) {
      const input = el.querySelector('.el-input__inner');
      if (input) {
        input.disabled = false;
        input.style.pointerEvents = 'auto';
        input.style.opacity = '1';
      }
    }
  },
  update: function (el, binding) {
    if (binding.value) {
      const input = el.querySelector('.el-input__inner');
      if (input) {
        input.disabled = false;
        input.style.pointerEvents = 'auto';
        input.style.opacity = '1';
      }
    }
  }
});

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


