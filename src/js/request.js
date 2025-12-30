import axios from "axios";
import router from "../router";

axios.defaults.baseURL = "https://wtodland.store/api";
// axios.defaults.baseURL = 'http://101.43.173.210:8081/api';
// axios.defaults.baseURL = 'http://104.168.214.109:8081/api';
axios.defaults.timeout = 100000;
axios.defaults.headers.post["Content-Type"] = "application/json";
// axios.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
axios.interceptors.request.use(
  function(config) {
    // console.log("发之前")
    // 在发送请求之前做些什么
    const token = localStorage.getItem("api_token");

    // 如果 token 存在，添加到请求头
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  function(error) {
    // 对请求错误做些什么
    console.log("发错了");
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  function(response) {
    // console.log("收之前")
    let data = response.data;
    return data;
  },
  function(error) {
    if (error.response.status === 401) {
      if (router.currentRoute.path === "/login") {
        return Promise.reject(error);
      }
      router.replace({
        path: "/login",
        query: {
          from: router.currentRoute.path
        }
      });
    }
    if (error.response.status === 403) {
      alert("您不是管理员，无权删除");
    }
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default axios;
