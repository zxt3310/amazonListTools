import Vue from "vue";
import Vuex from "vuex";
import router from "../router";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		// 存储页面A的临时数据
		tempPageAData: null,
		// 存储上一个路由信息
		previousRoute: null,
		userinfo:JSON.parse(localStorage.getItem("USER"))
	},
	mutations: {
		//退货列表数据保持
		setTempPageAData(state, data) {
			state.tempPageAData = JSON.parse(JSON.stringify(data));
		},
		//修改后离线展示
		setModifiedData(state,data){
			let list = state.tempPageAData.tableData;
			let index = list.findIndex(item=>item.id===data.id);
			if(index != -1){
				list[index] = data
			}
		},
		clearTempPageAData(state) {
			state.tempPageAData = null;
		},
		setPreviousRoute(state, route) {
			state.previousRoute = route;
		},
		//userinfo
		login(state,data){
			state.userinfo = JSON.parse(JSON.stringify(data));
			localStorage.setItem("USER",JSON.stringify(data));
			router.replace({
				path:"/"
			})
		},
		logout(state){
			state.userinfo = null;
			localStorage.removeItem("USER");
			router.replace({
				path:"/login"
			})
		}
	},
	actions: {},
	modules: {},
	getters:{
		isAdmin: state =>{
			return state.userinfo.is_admin;
		}
	}
});