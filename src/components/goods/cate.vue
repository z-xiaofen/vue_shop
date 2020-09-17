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
      <el-row>
        <el-col :span="8">
          <el-button type="primary" @click="RolesdialogVisible = true"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- Table -->
     <el-table :data="cateList" stripe border style="width: 100%">
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="cat_id" label="用户名"> </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 7, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
        //  参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      cateList: []
    }
  },
  watch: {},
  computed: {},
  created() {
    this.getCateList()
  },
  methods: {
   async getCateList() {
       const { data: res } = await this.$http.get('categories', {
            params: this.queryInfo
        })
       if (res.meta.status !== 200) {
          return this.$massage.error('获取商品分类列表失败！')
        }
       this.total = res.data.total
       this.cateList = res.data.result
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList() //  在更改了queryinfo里面的数据后要重新获取用户列表
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    }
  },
  mounted() {}
}
</script>
<style lang="less" scoped></style>
