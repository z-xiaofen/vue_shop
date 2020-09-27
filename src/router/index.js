import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../components/Login.vue'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login.vue')
// import Home from '../components/Home.vue'
// import Wel from '../components/welcome.vue'
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home.vue')
const Wel = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/welcome.vue')
// import Users from '../components/user/users.vue'
// import Rights from '../components/power/rights.vue'
// import Roles from '../components/power/roles.vue'
const Users = () => import(/* webpackChunkName: "users_rights_roles" */ '../components/user/users.vue')
const Rights = () => import(/* webpackChunkName: "users_rights_roles" */ '../components/power/rights.vue')
const Roles = () => import(/* webpackChunkName: "users_rights_roles" */ '../components/power/roles.vue')
// import Cate from '../components/goods/cate.vue'
// import Params from '../components/goods/params.vue'
// import List from '../components/goods/list.vue'
const Cate = () => import(/* webpackChunkName: "cate_params_list" */ '../components/goods/cate.vue')
const Params = () => import(/* webpackChunkName: "cate_params_list" */ '../components/goods/params.vue')
const List = () => import(/* webpackChunkName: "cate_params_list" */ '../components/goods/list.vue')
// import Add from '../components/goods/add.vue'
// import Order from '../components/order/order.vue'
// import Report from '../components/report/report.vue'
const Add = () => import(/* webpackChunkName: "add_order_report" */ '../components/goods/add.vue')
const Order = () => import(/* webpackChunkName: "add_order_report" */ '../components/order/order.vue')
const Report = () => import(/* webpackChunkName: "add_order_report" */ '../components/report/report.vue')
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Wel },
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Cate },
        { path: '/params', component: Params },
        { path: '/goods', component: List },
        { path: '/goods/add', component: Add },
        { path: '/orders', component: Order },
        { path: '/reports', component: Report }
      ]
    }
  ]
})

// 挂载路由导航守望
router.beforeEach((to, from, next) => {
  // to  将要访问
  // from 从哪个路径跳转而来
  // next 为一个函数  表示 放行
  //   next() 放行
  //   next('/login') 强制跳转
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
