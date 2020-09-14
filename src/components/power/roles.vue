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
                   <el-button type="primary">添加角色</el-button>
               </el-col>
          </el-row>
          <el-table :data="rolesList" stripe border style="width: 100%">
            <!-- :data="userList"绑定数据对象  -->
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="roleName" label="角色名称"> </el-table-column>
            <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
          </el-table>
      </el-card>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
        rolesList: []
    };
  },
  watch: {},
  computed: {},
  methods: {
     async getRolesList() {
         const { data: res } = await this.$http.get('roles')
         if (res.meta.status !== 200) {
            return this.$massage.error('获取角色列表失败！')
         }
         this.rolesList = res.data
      }
  },
  created() {
      this.getRolesList()
  },
  mounted() {}
};
</script>
<style lang="less" scoped>
</style>