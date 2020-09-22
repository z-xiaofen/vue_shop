<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="queryGoodsList"
          >
            <el-button slot="append" icon="el-icon-search" @click="seachGoods"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
           <el-button type="primary" @click="addGoods"
            >添加商品</el-button
          >
        </el-col>
      </el-row>
      <!-- 商品列表 -->
      <el-table :data="goodsList" stripe border style="width: 100%">
      <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="100px"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="75px"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="150px">
          <template slot-scope="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140px">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-edit"
              type="primary"
              size="mini"
              @click="queryRoles(scope.row.id)"
              ></el-button
            >
            <el-button
              icon="el-icon-delete"
              type="danger"
              size="mini"
              @click="removeGoods(scope.row.goods_id)"
              ></el-button
            >
          </template>
        </el-table-column>
      </el-table>
       <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
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
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      goodsVal: '',
      goodsList: []
    }
  },
  watch: {},
  computed: {},
  methods: {
   async queryGoodsList() {
     const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$massage.error('获取商品列表失败！')
      }
      this.total = res.data.total
      this.goodsList = res.data.goods
    },
    addGoods() {},
    // 监听pagesize改变的函数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.queryGoodsList() //  在更改了queryinfo里面的数据后要重新获取用户列表
    },
    // 监听pagesize改变的函数
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.queryGoodsList()
    },
    // 商品搜索
    seachGoods() {
      this.queryGoodsList()
    },
    // 删除商品
   async removeGoods(id) {
      const confirmRe = await this.$confirm(
        '此操作将永久删除该属性, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => {
        return err
      })
      // 如果用户确认删除 返回 值为字符串 --> confirm
      // 如果用户取消删除 返回 值为字符串 --> cancel
      if (confirmRe !== 'confirm') {
        return this.$massage.info('取消了删除操作')
      }
      const { data: res } = await this.$http.delete('goods/' + id)
      if (res.meta.status !== 200) {
        return this.$massage.error('删除商品失败')
      }
      this.$massage.success('删除商品成功!')
      this.queryGoodsList()
    }
  },
  created() {
    this.queryGoodsList()
  },
  mounted() {}
}
</script>
<style lang="less" scoped></style>
