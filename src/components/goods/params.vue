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
          <el-button type="primary" size="mini" :disabled="isDisable" @click="ParamsDialog"
            >添加参数</el-button
          >
          <el-table :data="mangTableData" stripe border style="width: 100%">
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="动态参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
              <el-button
                icon="el-icon-edit"
                type="primary"
                size="mini"
                @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button
              >
              <el-button
                icon="el-icon-delete"
                type="danger"
                size="mini"
                @click="deleteParams(scope.row.attr_id)"
                >删除</el-button
              >
            </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isDisable"  @click="ParamsDialog"
            >添加属性</el-button
          >
          <el-table :data="onlyTableData" stripe border style="width: 100%">
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="静态属性名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
              <el-button
                icon="el-icon-edit"
                type="primary"
                size="mini"
                @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button
              >
              <el-button
                icon="el-icon-delete"
                type="danger"
                size="mini"
                @click="deleteParams(scope.row.attr_id)"
                >删除</el-button
              >
            </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加动态参数和静态属性的共用对话框 -->
    <el-dialog
      :title="'添加' + dialogText"
      :visible.sync="addialogVisible"
      width="50%"
      @close="addCateDialogCls">
     <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="dialogText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改 -->
    <el-dialog
      :title="'编辑' + dialogText"
      :visible.sync="editialogVisible"
      width="50%"
      @close="editCateDialogCls">
     <el-form
        :model="editForm"
        :rules="addFormRules"
        ref="ediFormRules"
        label-width="100px"
      >
        <el-form-item :label="dialogText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
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
      onlyTableData: [],
      // 添加动态参数和静态属性的共用对话框
      addialogVisible: false,
      addForm: {
        attr_name: ''
      },
      addFormRules: {
         attr_name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 2, max: 12, message: '长度在 2 到 12 个字符', trigger: 'blur' }
        ]
      },
      // 编辑动态参数和静态属性
      editialogVisible: false,
      editForm: {}
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
    },
    dialogText() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
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
    },
    // 添加动态参数和静态属性的共用对话框
    addCateDialogCls() {
      this.$refs.addFormRef.resetFields()
    },
    ParamsDialog() {
      this.addialogVisible = true
    },
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) {
          return this.$massage.error('添加失败')
        }
        this.$massage.success('添加成功')
        this.addialogVisible = false
        this.handleChange()
      })
    },
    // 编辑动态参数和静态属性
    editCateDialogCls() {
      this.$refs.ediFormRules.resetFields()
    },
   async showEditDialog(id) {
     const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${id}`, {
       params: {
         attr_se: this.activeName
       }
     })
    if (res.meta.status !== 200) {
          return this.$massage.error('获取参数失败')
        }
    this.editForm = res.data
    this.editialogVisible = true
    },
   async editParams() {
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
        attr_name: this.editForm.attr_name,
        attr_sel: this.activeName
      })
      if (res.meta.status !== 200) {
          return this.$massage.error('修改失败')
        }
        this.$massage.success('修改成功')
        this.handleChange()
        this.editialogVisible = false
    },
    // 删除参数
   async deleteParams(id) {
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
      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
      if (res.meta.status !== 200) {
        return this.$massage.error('分类属性失败')
      }
      this.$massage.success('分类属性成功')
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
