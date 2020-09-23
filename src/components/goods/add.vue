<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        :closable="false"
        show-icon
        center
      ></el-alert>
      <!-- steps步骤条 -->
      <el-steps :active="activeName - 0" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tabs标签页 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs :tab-position="'left'" v-model="activeName" :before-leave="beforeTabLeave">
          <el-tab-pane name="0" label="基本信息">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input type="number" v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input type="number" v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input type="number" v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="selectCateList"
                :props="selectCateProps"
                clearable
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="1" label="商品参数"></el-tab-pane>
          <el-tab-pane name="2" label="商品属性">商品属性</el-tab-pane>
          <el-tab-pane name="3" label="商品图片">商品图片</el-tab-pane>
          <el-tab-pane name="4" label="商品内容">商品内容</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      activeName: '0',
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 2, max: 12, message: '长度在 2 到 12 个字符', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请输入选择商品分类', trigger: 'blur' }
        ]
      },
      selectCateList: [],
      selectCateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: false
      },
      cateKeys: []
    }
  },
  watch: {},
  computed: {},
  methods: {
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
        return
      }
      console.log(this.addForm.goods_cat)
    },
    async queryAllCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$massage.error('获取商品分类列表失败！')
      }
      this.selectCateList = res.data
      console.log(this.selectCateList)
    },
    beforeTabLeave(activeName, oldActiveName) {
        // activeName     即将进入的 tab 名名称
        // oldActiveName  即将切换到的 tab 的名称
        if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
            this.$massage.error('请选择商品分类')
            return false
            // return false 阻止tab栏切换
        }
    }
  },
  created() {
    this.queryAllCateList()
  },
  mounted() {}
}
</script>
<style lang="less" scoped></style>
