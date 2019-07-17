import Vue from 'vue'
import axios from 'axios'
// 默认根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 请求拦截 每次携带 Authorization字段
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须 return config
  return config
})
// 挂载到Vue原型上
Vue.prototype.$http = axios
