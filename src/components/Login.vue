<template>
  <div class="login_contaniner">
    <div class="login_box">
      <!-- logo -->
      <div class="img_box">
        <img src="../assets/hzw.jpg" alt="" />
      </div>
      <!-- form -->
      <!-- LoginFormRef 为表单对象的实例对象 -->
      <el-form
        ref="LoginFormRef"
        label-width="0px"
        class="form"
        :model="form"
        :rules="rules"
      >
        <el-form-item prop="username">

          <el-input
            v-model="form.username"
            placeholder="用户名"
            prefix-icon="iconfont icon-user"
          ></el-input>

        </el-form-item>

        <el-form-item prop="password">

          <el-input
            v-model="form.password"
            type="password"
            placeholder="密码"
            prefix-icon="iconfont icon-3702mima"
          ></el-input>

        </el-form-item>

        <el-form-item class="but">

          <el-button type="primary" @click="login">登录</el-button>

          <el-button type="info" @click="reset">重置</el-button>

        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登录表单的数据绑定对象
      form: {
        username: '',
        password: ''
      },
      // 表单的验证规则
      rules: {
        // 使用————在需要使用的输入框的 el-form-item 标签里加上 prop=“ ”
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    reset() {
      // 清空输入框中的内容  resetFields() 为Element UI提供的 方法
      this.$refs.LoginFormRef.resetFields()
      // this为当前的表单对象
    },
    login() {
      this.$refs.LoginFormRef.validate(async (valid) => {
        //  validate()   对 整个表单进行校验的方法，参数为一个回调函数
        // valid 为一个布尔类型  true 为验证成功  false 为失败
        if (!valid) return
        const { data } = await this.$http.post('login', this.form)
        if (data.meta.status !== 200) return this.$massage.error('登录失败')
        this.$massage.success('登录成功')
        //  将登录成功的token 保存在客户端的sessionStorage里
        window.sessionStorage.setItem('token', data.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>
<style lang="less" scoped>
.login_contaniner {
  background: #41b782;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 6px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .img_box {
    width: 115px;
    height: 115px;
    border: 1px solid #eee;
    border-radius: 50%;
    overflow: hidden;
    background-color: #eee;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.form {
  position: absolute;
  bottom: 10px;
  width: 100%;
  padding: 0 40px;
  box-sizing: border-box;
}
.but {
  display: flex;
  justify-content: center;
}
</style>
