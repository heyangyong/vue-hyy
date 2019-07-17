import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入字体 图标
import './assets/fonts/iconfont.css'
// 全局less配置
import './assets/css/base.less'
import './plugins/element.js'
// // 手动配置element - ui
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
// Vue.use(ElementUI)

import axios from 'axios'
// 默认根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
