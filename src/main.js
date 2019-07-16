import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/base.less'
import './plugins/element.js'
// // 手动配置element - ui
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
