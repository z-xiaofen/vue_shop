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
          <el-button type="primary" @click="addCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- Table -->
      <tree-table class="tree-table" :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border :show-row-hover="false">
        <!-- columns 定义在data里面 用来设置表格中的 列属性 -->
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:#16a05d"></i>
          <i class="el-icon-error" v-else style="color:#dc4e41"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag type="success" size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="warning" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="danger" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditCate(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteCate(scope.row)">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="catedialogVisible" width="50%" @close="addCateDialogCls">
      <el-form :model="caleForm" :rules="calerules" ref="caleFormref" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="caleForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" prop="cat_name">
          <el-cascader v-model="cateKeys" :options="selectCateList" :props="selectCateProps" clearable change-on-select @change="handleChange"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="catedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类信息对话框 -->
    <el-dialog title="编辑分类信息" :visible.sync="editdialogVisible" width="50%" @close="editDialogCls">
      <el-form :model="editForm" :rules="editrules" ref="editCateFormRef" label-width="70px">
        <el-form-item label="分类名" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
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
      //  参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      //  tree-table 数据
      cateList: [],
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          //  表示将当前列设置成为模板列
          type: 'template',
          //  表示当前列使用的模板名称
          template: 'isok'
        },
        {
          label: '排序',
          //  表示将当前列设置成为模板列
          type: 'template',
          //  表示当前列使用的模板名称
          template: 'order'
        },
        {
          label: '操作',
          //  表示将当前列设置成为模板列
          type: 'template',
          //  表示当前列使用的模板名称
          template: 'opt'
        }
      ],
      // 添加分类对话框
      catedialogVisible: false,
      // 编辑分类信息对话框
      editdialogVisible: false,
      caleForm: {
        cat_name: '',
        // 默认添加的分类为 一级
        cat_level: 0,
        // cat_pid 分类父 ID
        cat_pid: 0
      },
      // caleForm校验规则
      calerules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 2, max: 12, message: '长度在 2 到 12 个字符', trigger: 'blur' }
        ]
      },
      // 级联选择器
      cateKeys: [],
      // 级联选择器渲染的数据列表
      selectCateList: [],
      selectCateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 编辑分类信息对话框
      editForm: {},
      editrules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 2, max: 12, message: '长度在 2 到 12 个字符', trigger: 'blur' }
        ]
      },
      // 当前选择的分类的id activeCateId
      activeCateId: ''
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
        return this.$message.error('获取商品分类列表失败！')
      }
      this.total = res.data.total
      this.cateList = res.data.result
    },
    // 监听pagesize改变的函数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList() //  在更改了queryinfo里面的数据后要重新获取用户列表
    },
    // 监听pagesize改变的函数
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 关闭添加分类对话框
    addCateDialogCls() {
      this.$refs.caleFormref.resetFields()
      this.caleForm.cat_level = 0
      this.caleForm.cat_pid = 0
      this.cateKeys = []
    },
    // 编辑分类信息对话框
    editDialogCls() {
      this.$refs.editCateFormRef.resetFields()
    },
    // 添加分类对话框
    async addCateDialog() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败！')
      }
      this.selectCateList = res.data
      this.catedialogVisible = true
    },
    async addCate() {
      //  对表单进行预验证
      this.$refs.caleFormref.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.caleForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败！')
        }
        this.$message.success('添加分类成功 ！')
        this.getCateList()
        this.catedialogVisible = false
      })
    },
    // 获取父级分类列表
    getParentCateList() {},
    // 当级联选择器的数据发生改变 将caleForm中的数据进行更正
    handleChange() {
      if (this.cateKeys.length !== 0) {
        this.caleForm.cat_level = this.cateKeys.length
        this.caleForm.cat_pid = this.cateKeys[this.cateKeys.length - 1]
      } else {
        this.caleForm.cat_level = 0
        this.caleForm.cat_pid = 0
      }
    },
    async showEditCate(activeCate) {
      this.activeCateId = activeCate.cat_id
      const { data: res } = await this.$http.get('categories/' + activeCate.cat_id)
      if (res.meta.status !== 200) {
        return this.$message.error('分类信息查询失败！')
      }
      this.editForm = res.data
      this.editdialogVisible = true
    },
    async deleteCate(activeCate) {
      const confirmRe = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => {
        return err
      })
      // 如果用户确认删除 返回 值为字符串 --> confirm
      // 如果用户取消删除 返回 值为字符串 --> cancel
      if (confirmRe !== 'confirm') {
        return this.$message.info('取消了删除操作')
      }
      const { data: res } = await this.$http.delete('categories/' + activeCate.cat_id)
      if (res.meta.status !== 200) {
        return this.$message.error('分类删除失败')
      }
      this.$message.success('分类删除成功')
      this.getCateList()
    },
    async editCate() {
      const { data: res } = await this.$http.put('categories/' + this.activeCateId, {
        cat_name: this.editForm.cat_name
      })
      if (res.meta.status !== 200) {
        return this.$message.error('分类信息更新失败！')
      }
      this.$message.success('添加分类成功 ！')
      this.editdialogVisible = false
      this.getCateList()
    }
  },
  mounted() {}
}
</script>
<style lang="less" scoped>
.tree-table {
  margin-top: 15px;
  margin-bottom: 15px;
  font-size: 13px;
}
.el-cascader {
  width: 100%;
}
</style>
