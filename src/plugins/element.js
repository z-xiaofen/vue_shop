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
    MenuItem,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Row,
    Col,
    Table,
    TableColumn,
    Switch,
    Tooltip,
    Pagination,
    Dialog,
    MessageBox,
    Tag,
    Tree,
    Select,
    Option,
    Cascader,
    Alert,
    Tabs,
    TabPane
} from 'element-ui'
// 按需导入Element UI

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

// 面包屑
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)

// 卡片
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)

// 分页
Vue.use(Pagination)

// 对话框
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)

// 级联选择器
Vue.use(Cascader)
    // Alert
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)


// 全局挂载
Vue.prototype.$massage = Message
Vue.prototype.$confirm = MessageBox.confirm