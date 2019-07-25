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

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import moment from 'moment'
// 将富文本编辑器，注册为全局可用的组件
Vue.use(VueQuillEditor)

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
