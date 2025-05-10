import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		// 存储页面A的临时数据
		tempPageAData: null,
		// 存储上一个路由信息
		previousRoute: null
	},
	mutations: {
		setTempPageAData(state, data) {
			state.tempPageAData = JSON.parse(JSON.stringify(data));
		},
		clearTempPageAData(state) {
			state.tempPageAData = null;
		},
		setPreviousRoute(state, route) {
			state.previousRoute = route;
		}
	},
	actions: {},
	modules: {}
});