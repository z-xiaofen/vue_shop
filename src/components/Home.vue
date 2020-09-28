<template>
  <el-container class="home-con">
    <el-header>
      <div>
        <img src="../assets/u=442259188,2581418443&fm=26&gp=0.jpg" alt="字节跳动" title="你关心的才是头条" />
        <span>字节跳动后台管理系统</span>
      </div>
      <el-button type="info" plain @click="out">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle" @click="toggleColl">
          |||
        </div>
        <!-- 侧边栏内的导航栏 -->
        <el-menu
          background-color="#313743"
          text-color="#fff"
          active-text-color="#4c94d5"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!--:collapse-transition="false" 取消动画
            :unique-opened="true"   是否只保持一个子菜单的展开
            :collapse="isCollapse"  是否水平折叠收起菜单（仅在 mode 为 vertical 时可用）
            :router="true" 开启路由模式是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转
         -->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单 -->
            <template slot="title">
              <i :class="ico[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + info.path" v-for="info in item.children" :key="info.id" @click="sevePath('/' + info.path)">
              <!-- el-menu-item 里面的 :index 为 路由地址 与 router-link 的:to 一样 -->
              <!-- @click="sevePath('/' + info.path) 函数将 当前的路由地址存储在 sessionStorage 中 -->
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ info.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体 -->
      <el-main>
        <router-view>
          <!-- 路由占位符 -->
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      menulist: '',
      ico: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao',
        101: 'iconfont icon-shangpin'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  watch: {},
  computed: {},
  created() {
    // created() 为vue钩子函数
    this.getMenulist()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 登出
    out() {
      window.sessionStorage.clear()
      this.$router.push('/login')
      this.$message.success('退出成功')
    },
    // 获取菜单
    async getMenulist() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.menulist = res.data
    },
    // 侧边栏的折叠与展开
    toggleColl() {
      this.isCollapse = !this.isCollapse
    },
    // 将当前的路由地址添加到sessionStorage里
    sevePath(active) {
      window.sessionStorage.setItem('activePath', active)
      this.activePath = active
    }
  },
  mounted() {}
}
</script>
<style lang="less" scoped>
.home-con {
  height: 100%;
}
.el-header {
  background-color: #282c34;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 8px;
  font-size: 20px;
  > div {
    height: 100%;
    display: flex;
    align-items: center;
    img {
      display: block;
      border-radius: 50%;
      height: 100%;
    }
    span {
      padding-left: 20px;
      color: #e9edf1;
    }
  }
}
.el-aside {
  background: #313743;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #e9edf1;
}
.iconfont {
  margin-right: 10px;
}
.toggle {
  background-color: #475166;
  color: white;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
