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
          <el-button type="primary" @click="adddialogVisible=true">添加用户</el-button>
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
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUser(scope.row.id)"
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
        :page-sizes="[2, 3, 5, 6]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
        title="添加用户"
        :visible.sync="adddialogVisible"
        width="50%" @close="addDialogCls">
        <el-form :model="addForm" :rules="rules" ref="addUsersForm" label-width="70px">
          <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
        <el-button @click="adddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 编辑用户信息对话框 -->
    <el-dialog
      title="编辑用户信息"
      :visible.sync="editdialogVisible"
      width="50%" @close="editDialogCls">
      <el-form :model="editForm" :rules="editrules" ref="editUsersForm" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    // 验证邮箱地址的规则
     var checkEmail = (rule, value, callback) => {
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        if (regEmail.test(value)) {
          return callback()
        }
        callback(new Error('请输入合法的邮箱'))
      };
    // 验证手机号的规则
    var checkMobile = (rule, value, callback) => {
       const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
        if (regMobile.test(value)) {
          return callback()
        }
        callback(new Error('请输入合法的手机号码'))
      };
    return {
      queryInfo: {
        query: '',
        // 当前的页码
        pagenum: 1,
        // 当前每个页面显示多少条数据
        pagesize: 6
      },
      userList: [],
      total: 0,
      adddialogVisible: false,
      editdialogVisible: false,
      // 添加用户表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
      },
      // 添加表单验证规则
      rules: {
         // 使用————在需要使用的输入框的 el-form-item 标签里加上 prop=“ ”
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入密码', trigger: 'blur' },
           { validator: checkEmail, trigger: 'blur' }
        ],
         mobile: [
          { required: true, message: '请输入密码', trigger: 'blur' },
           { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editrules: {
        email: [
          { required: true, message: '请输入密码', trigger: 'blur' },
           { validator: checkEmail, trigger: 'blur' }
        ],
         mobile: [
          { required: true, message: '请输入密码', trigger: 'blur' },
           { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {},
  computed: {},
  created() {
    this.newqueryUserList()
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
    },
    async newqueryUserList() {
      const { data: res } = await this.$http.get('/users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$massage.error('获取用户列表失败！')
      }
      this.userList = res.data.users
      this.total = res.data.total
      this.$massage.success('获取用户列表成功！')
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
    },
    // 监听对话框的关闭事件
    addDialogCls() {
      this.$refs.addUsersForm.resetFields()
    },
    editDialogCls() {
      this.$refs.editUsersForm.resetFields()
    },
    // 添加用户
    addUser() {
      this.$refs.addUsersForm.validate(async (valid) => {
        if (!valid) return
      const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
        return this.$massage.error('添加用户失败')
      }
      this.$massage.success('添加用户成功')
      this.adddialogVisible = false
      this.queryUserList()
      })
    },
    // 展示编辑用户的对话框
   async showEditDialog(id) {
     const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) return this.$massage.error('查询用户信息失败')
      this.editForm = res.data
      this.editdialogVisible = true
    },
    // 编辑用户
    editUser() {
      this.$refs.editUsersForm.validate(async (valid) => {
        if (!valid) return
      const { data: res } = await this.$http.put('users/' + this.editForm.id, { email: this.editForm.email, mobile: this.editForm.mobile })
        if (res.meta.status !== 200) {
        return this.$massage.error('修改用户信息失败')
      }
      this.$massage.success('修改用户信息成功')
      this.editdialogVisible = false
      this.queryUserList()
      })
    },
    // 删除用户
   async deleteUser(id) {
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) return this.$massage.error('用户删除失败')
      this.$massage.success('用户删除成功')
      this.queryUserList()
    }
  },
  mounted() {}
}
</script>
<style lang="less" scoped></style>
