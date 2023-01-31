import axios from 'axios';
import Vue from 'vue';

axios.defaults.baseURL = 'http://104.168.214.109:8081/api';
// instance.defaults.timeout = 2500;
// axios.defaults.headers.post['Content-Type'] = 'application/json';
// axios.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
axios.interceptors.request.use(function(config) {
	console.log("发之前")
	// 在发送请求之前做些什么
	return config;
}, function(error) {
	// 对请求错误做些什么
	console.log("发错了")
	return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function(response) {
	// console.log(response)
	console.log("收之前")
	let data = response.data;
	return data;
}, function(error) {
	console.log("收错了！")
	// 对响应错误做点什么
	return Promise.reject(error);
});



export default axios;
