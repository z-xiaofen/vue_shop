<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-alert
        title="注意：只能为第三级分类设置相关参数"
        type="warning"
        :closable="false"
        show-icon
      ></el-alert>
      <!-- 级联选择器 -->
      <el-row class="cascader">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="cateKeys"
            :options="selectCateList"
            :props="selectCateProps"
            clearable
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isDisable"
            >添加参数</el-button
          >
          <el-table :data="mangTableData" stripe border style="width: 100%">
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="角色名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
              <el-button
                icon="el-icon-edit"
                type="primary"
                size="mini"
                @click="queryRoles(scope.row.id)"
                >编辑</el-button
              >
              <el-button
                icon="el-icon-delete"
                type="danger"
                size="mini"
                @click="removeRoles(scope.row.id)"
                >删除</el-button
              >
            </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isDisable"
            >添加属性</el-button
          >
          <el-table :data="onlyTableData" stripe border style="width: 100%">
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="角色名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
              <el-button
                icon="el-icon-edit"
                type="primary"
                size="mini"
                @click="queryRoles(scope.row.id)"
                >编辑</el-button
              >
              <el-button
                icon="el-icon-delete"
                type="danger"
                size="mini"
                @click="removeRoles(scope.row.id)"
                >删除</el-button
              >
            </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      // 级联选择器
      cateKeys: [],
      selectCateList: [],
      selectCateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: false
      },
      activeName: 'many',
      mangTableData: [],
      onlyTableData: []

    }
  },
  watch: {},
  computed: {
    isDisable() {
      if (this.cateKeys.length !== 3) {
        return true
      } else {
        return false
      }
    },
    cateId() {
      if (this.cateKeys.length === 3) {
        return this.cateKeys[2]
      }
      return null
    }
  },
  methods: {
    async queryAllCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$massage.error('获取商品分类列表失败！')
      }
      this.selectCateList = res.data
    },
    async handleChange() {
      //   利用级联选择器绑定的array数组的长度 length 来判断 选中的是不是三级菜单
      if (this.cateKeys.length !== 3) {
        this.cateKeys = []
        return
      }
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: {
            sel: this.activeName
          }
        }
      )
      if (res.meta.status !== 200) {
        return this.$massage.error('获取参数列表失败！')
      }
      if (this.activeName === 'many') {
        this.mangTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    handleClick() {
      this.handleChange()
    }
  },
  created() {
    this.queryAllCateList()
  },
  mounted() {}
}
</script>
<style lang="less" scoped>
.cascader {
  margin: 15px 0;
}
.el-cascader {
  width: 300px;
}
</style>
