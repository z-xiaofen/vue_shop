<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <!-- :gutter="20" 列的间距 -->
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="queryUserList">
            <el-button slot="append" icon="el-icon-search" @click="queryUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="userList" stripe border style="width: 100%">
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="username" label="用户名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!-- scope.row 为当前这一列的数据  为一个对象 {username,email,mobile.......} -->
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="50%">
        <span>这是一段信息</span>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      queryInfo: {
        query: '',
        // 当前的页码
        pagenum: 1,
        // 当前每个页面显示多少条数据
        pagesize: 2
      },
      userList: [],
      total: 0,
      dialogVisible: false
    }
  },
  watch: {},
  computed: {},
  created() {
    this.queryUserList()
  },
  methods: {
    async queryUserList() {
      const { data: res } = await this.$http.get('/users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$massage.error('获取用户列表失败！')
      }
      this.userList = res.data.users
      this.total = res.data.total
      this.$massage.success('获取用户列表成功')
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.queryUserList()//  在更改了queryinfo里面的数据后要重新获取用户列表
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.queryUserList()
    },
   async userStateChange(userinfo) {
        const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
        if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$massage.error('用户状态修改失败！')
      }
      this.$massage.success('用户状态修改成功！')
    }
  },
  mounted() {}
}
</script>
<style lang="less" scoped></style>
