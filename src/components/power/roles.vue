<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-button type="primary" @click="RolesdialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" stripe border style="width: 100%">
        <!-- :data="userList"绑定数据对象  -->
        <!-- type="expand"  ==>  为展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item1, i1) in scope.row.children" :key="item1.id" :class="['bottomB', i1 === 0 ? 'topB' : '', 'Elcenter']">
              <el-col :span="5">
                <!-- 111111111111111111111111级权限 -->
                <el-tag closable @close="removeRbyID(scope.row, item1.id)">{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row v-for="(item2, i2) in item1.children" :key="item2.id" :class="[i2 === 0 ? '' : 'topB', 'Elcenter']">
                  <el-col :span="6">
                    <!-- 222222222222222222222222级权限 -->
                    <el-tag type="success" closable @close="removeRbyID(scope.row, item2.id)">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 333333333333333333333333级权限 -->
                    <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable @close="removeRbyID(scope.row, item3.id)">{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- type="index"  ==>  为索引列 -->
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" type="primary" size="mini" @click="queryRoles(scope.row.id)">编辑</el-button>
            <el-button icon="el-icon-delete" type="danger" size="mini" @click="removeRoles(scope.row.id)">删除</el-button>
            <el-button icon="el-icon-setting" type="warning" size="mini" @click="showSetRoles(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加角色" :visible.sync="RolesdialogVisible" width="50%" @close="addRolesDialogCls">
      <el-form :model="addRoles" :rules="rules" ref="addRolesForm" label-width="70px">
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="addRoles.roleName"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="roleDesc">
          <el-input v-model="addRoles.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="RolesdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户信息对话框 -->
    <el-dialog title="编辑角色信息" :visible.sync="editdialogVisible" width="50%" @close="editDialogCls">
      <el-form :model="editForm" :rules="editrules" ref="editUsersForm" label-width="70px">
        <el-form-item label="id">
          <el-input v-model="editForm.roleId" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRolesdialogVisible" width="50%" @close="setRolesDialogCls">
      <el-tree :data="setRolesList" :props="defaultProps" default-expand-all show-checkbox node-key="id" :default-checked-keys="rolseListKeys" ref="setRolesRef"></el-tree>
      <!-- :default-checked-keys="rolseListKeys" 默认选中的节点  rolseListKeys为一个数组 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRolesdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
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
      // 获取角色列表失败！
      rolesList: [],
      // 添加用户对话框
      RolesdialogVisible: false,
      // 编辑用户信息对话框
      editdialogVisible: false,
      // 分配权限对话框
      setRolesdialogVisible: false,
      // 所有权限的数据
      setRolesList: [],
      // 默认选中节点的id值
      rolseListKeys: [],
      roleId: '',
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      editForm: {},
      addRoles: {
        roleName: '',
        roleDesc: ''
      },
      rules: {
        // 使用————在需要使用的输入框的 el-form-item 标签里加上 prop=“ ”
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 12, message: '长度在 2 到 12 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
        ]
      },
      editrules: {
        // 使用————在需要使用的输入框的 el-form-item 标签里加上 prop=“ ”
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 12, message: '长度在 2 到 12 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {},
  computed: {},
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }
      this.rolesList = res.data
    },
    addRolesDialogCls() {
      this.$refs.addRolesForm.resetFields()
    },
    editDialogCls() {
      this.$refs.editUsersForm.resetFields()
    },
    setRolesDialogCls() {
      this.rolseListKeys = []
    },
    addRole() {
      this.$refs.addRolesForm.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('roles', this.addRoles)
        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败')
        }
        this.$message.success('添加角色成功')
        this.RolesdialogVisible = false
        this.getRolesList()
      })
    },
    // 编辑角色信息
    editRole() {
      this.$refs.editUsersForm.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('roles/' + this.editForm.roleId, { roleName: this.editForm.roleName, roleDesc: this.editForm.roleDesc })
        if (res.meta.status !== 200) {
          return this.$message.error('修改角色信息失败')
        }
        this.$message.success('修改角色信息成功')
        this.editdialogVisible = false
        this.getRolesList()
      })
    },
    // 根据ID删除角色
    async removeRoles(id) {
      // 弹框询问
      const confirmRes = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => {
        return err
      })
      // 如果用户确认删除 返回 值为字符串 --> confirm
      // 如果用户取消删除 返回 值为字符串 --> cancel
      if (confirmRes !== 'confirm') return this.$message.info('取消了删除操作')
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('角色删除失败')
      this.$message.success('角色删除成功')
      this.getRolesList()
    },
    // 根据ID查询角色
    async queryRoles(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败')
      }
      this.editForm = res.data
      this.editdialogVisible = true
    },
    // 根据ID删除权限
    async removeRbyID(roles, id) {
      const confirmRe = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => {
        return err
      })
      // 如果用户确认删除 返回 值为字符串 --> confirm
      // 如果用户取消删除 返回 值为字符串 --> cancel
      if (confirmRe !== 'confirm') return this.$message.info('取消了删除操作')
      const { data: res } = await this.$http.delete(`roles/${roles.id}/rights/${id}`)
      if (res.meta.status !== 200) return this.$message.error('角色删除失败')
      this.$message.success('角色删除成功')
      // 将服务器返回的最新数据 data 赋值给 roles.children (基于Vue的数据双向绑定)
      roles.children = res.data
    },
    // 分配权限
    async showSetRoles(roles) {
      this.roleId = roles.id
      this.setRolesdialogVisible = true
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限失败！')
      }
      this.queryRolesID(roles, this.rolseListKeys)
      this.setRolesList = res.data
    },
    // 递归节点查询id
    queryRolesID(node, arr) {
      // 当 当前节点没有 children 属性时 证明他是最低权限
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.queryRolesID(item, arr)
      })
    },
    // 点击为角色分配权限
    async allotRights() {
      //  所有被选中的三级权限的id  与半选中的 一级，二级权限的id
      const keys = [
        ...this.$refs.setRolesRef.getCheckedKeys(),
        // 若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点所组成的数组
        ...this.$refs.setRolesRef.getHalfCheckedKeys()
        // 若节点可被选择（即 show-checkbox 为 true），则返回目前半选中的节点所组成的数组
      ]
      const idStr = keys.join(',') // 将数组转成字符串 之间用','隔开
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败！')
      }
      this.$message.success('分配权限成功！')
      this.getRolesList()
      this.setRolesdialogVisible = false
    }
  },
  created() {
    this.getRolesList()
  },
  mounted() {}
}
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bottomB {
  border-bottom: 1px solid #eee;
}
.topB {
  border-top: 1px solid #eee;
}
.Elcenter {
  display: flex;
  align-items: center;
}
</style>
