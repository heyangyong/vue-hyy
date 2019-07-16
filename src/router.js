import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login/index.vue'

// import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    redirect: '/login'
  }, {
    path: '/login',
    component: Login
  }

  ]
})
