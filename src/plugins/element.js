import Vue from 'vue'
import {
    Form,
    FormItem,
    Button,
    Input,
    Message,
    Container,
    Header,
    Aside,
    Main,
    Menu,
    Submenu,
    MenuItem
} from 'element-ui'


Vue.use(Button)
Vue.use(FormItem)
Vue.use(Form)
Vue.use(Input)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Header)

// 侧边栏菜单
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(Menu)

// 全局挂载
Vue.prototype.$massage = Message