import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 引入 Element UI
import './plugins/element.js'
// 引入 自定义 的全局样式表
import './assets/css/global.css'
// 引入 阿里妈妈 字体图标
import './assets/fonts/iconfont.css'
import axios from 'axios'

Vue.config.productionTip = false
    // 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
        // config 为请求 对象
        config.headers.Authorization = window.sessionStorage.getItem('token')
            // 一定在最后 return config
        return config
    })
    // 将 axios 挂载到 vue 全局  命名为 $http
Vue.prototype.$http = axios
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')