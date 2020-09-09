<template>
  <div class="login_contaniner">
      <div class="login_box">
        <!-- logo -->
         <div class="img_box">
           <img src="../assets/logo.png" alt="">
         </div>
         <!-- form -->
         <el-form  label-width="0px" class="form">

            <el-form-item :model="form">
              <el-input  placeholder="用户名" prefix-icon="iconfont icon-user"></el-input>
            </el-form-item>

             <el-form-item >
              <el-input  placeholder="密码" prefix-icon="iconfont icon-3702mima"></el-input>
            </el-form-item>

            <el-form-item class="but">
              <el-button type="primary">登录</el-button>
              <el-button type="info">重置</el-button>
            </el-form-item>

         </el-form>
      </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 登录表单的数据绑定对象
      form: {
        username: '',
        password: ''
      }
    }
  }
};
</script>
<style lang="less" scoped>
.login_contaniner{
    background: #41b782;
    height: 100%;
}
.login_box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    .img_box{
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      overflow: hidden;
      background-color: #eee;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%,-50%);
      img{
        width: 100%;
        height: 100%;
      }
    }
  }
  .form{
    position: absolute;
    bottom: 10px;
    width: 100%;
    padding: 0 40px;
    box-sizing: border-box;
  }
  .but{
    display: flex;
    justify-content: center;
  }
</style>