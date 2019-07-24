import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/Login/index.vue'
import Home from '../views/Home/index.vue'
import Welcome from '../views/Home/Welcome'
import Users from '../views/Home/Users'
import Rights from '../views/Home/power/rights'
import Roles from '../views/Home/power/roles'
import Goods from '../views/Home/goods/goods'
import Params from '../views/Home/goods/params'
import Categories from '../views/Home/goods/categories'
import Add from '../views/Home/goods/add'
Vue.use(Router)

// export default router
const router = new Router({
  routes: [
    { path: '/', redirect: '/home' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/home/welcom',
      children: [{
        path: '/home/welcom',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/goods',
        component: Goods
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/categories',
        component: Categories
      },
      {
        path: '/goods/add',
        component: Add
      }
      ]
    }
  ]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  // next()  放行    next('/login')  强制跳转

  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
