import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入字体 图标
import './assets/fonts/iconfont.css'
// 全局less配置
import './assets/css/base.less'
// 引入axios请求
import './api'

// 饿了么ui
import './plugins/element.js'

import TreeTable from 'vue-table-with-tree-grid'

import moment from 'moment'
Vue.filter('dateFormat', originVal => {
  return moment(originVal).format('MMMM Do YYYY, h:mm:ss a')
})

// // 手动配置element - ui
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
// Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
