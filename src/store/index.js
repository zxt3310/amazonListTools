import Vue from "vue";
import Vuex from "vuex";
import router from "../router";
import axios from "../js/request.js";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		// 存储页面A的临时数据
		tempPageAData: null,
		// 存储上一个路由信息
		previousRoute: null,
		userinfo: null, //JSON.parse(localStorage.getItem("USER"))
		//通知
		notifications:[]
	},
	mutations: {
		SET_USER_INFO(state, payload) {
			state.userinfo = payload
		},
		//退货列表数据保持
		setTempPageAData(state, data) {
			state.tempPageAData = JSON.parse(JSON.stringify(data));
		},
		//修改后离线展示
		setModifiedData(state, data) {
			let list = state.tempPageAData.tableData;
			let index = list.findIndex(item => item.id === data.id);
			if (index != -1) {
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
		login(state, data) {
			state.userinfo = JSON.parse(JSON.stringify(data));
			// localStorage.setItem("USER", JSON.stringify(data));
			router.replace({
				path: "/"
			})
		},
		logout(state) {
			state.userinfo = null;
			localStorage.removeItem("api_token");
			router.replace({
				path: "/login"
			})
		},
		recvNotif(state,data){
			state.notifications = [...data]
		}
	},
	actions: {
		async fetchUserInfo({
			commit
		}) {
			try {
				const data = await axios.get('getUser')
				commit('SET_USER_INFO', data.user)
				return data // 返回数据以便后续处理
			} catch (error) {
				console.error('获取用户信息失败', error)
				throw error // 抛出错误供调用方处理
			}
		},
		async fetchMessage({
			commit
		}){
			try{
				const data = await axios.get("getMessages")
				commit('recvNotif', data.data)
			} catch (error) {
				console.error('获取消息失败', error)
				throw error // 抛出错误供调用方处理
			}
		}
	},
	modules: {},
	getters: {
		isAdmin: state => {
			return state.userinfo.is_admin > 0;
		},
		isSuperAdmin: state => {
			return state.userinfo.is_admin == 2;
		}
	}
});