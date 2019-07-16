<template>
  <div id="login_container" class="login_container">
    <div class="login-box">
      <div class="avatar-box">
        <img src="./logo.png" alt="">
      </div>
      <el-form>
        <el-form-item>
          <el-input class="login-form"></el-input>
        </el-form-item>

        <el-form-item>
          <el-input class="login-form"></el-input>
        </el-form-item>

        <el-form-item>
        <el-button type="primary">登录</el-button>
        <el-button RESET>重置</el-button>
      </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {}
</script>
<style lang="less" scoped>
.login_container{
height: 100%;
  background: #2b4b6b;
  .login-box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

 .avatar-box{
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%,-50%);
      background-color: #fff;
      img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
      border: 1px solid #eee;
        background-color: #fff;
      }
    }
    .login-form{
          padding: 20px;
          width: 90%;
          top: 68px;
    }

  }
}
</style>
