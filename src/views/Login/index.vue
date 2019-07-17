<template>
  <div id="login_container" class="login_container">
    <div class="login-box">
      <!-- 头像 -->
      <div class="avatar-box">
        <img src="./logo.png" alt="">
      </div>
      <!-- 登录表单 -->
      <el-form class="login_form" :rules="loginRules" :model="loginFrom" ref="loginFromRef">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input placeholder="用户名" prefix-icon="iconfont icon-user" v-model="loginFrom.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input type="password" placeholder="密码" prefix-icon="iconfont icon-3702mima" v-model="loginFrom.password"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
        <el-button type="primary" @click="login">登录</el-button>
        <el-button @click="resetFrom">重置</el-button>
      </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>

export default {
  data: () => ({
    // 登录表单数据绑定
    loginFrom: {
      username: 'admin',
      password: '123456'
    },
    // 规则验证
    loginRules: {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
      ]
    }
  }),
  methods: {
    // 点击重置按钮 重置表单内容
    resetFrom () {
      console.log(this)
      this.$refs.loginFromRef.resetFields()
      this.loginFrom.username = this.loginFrom.password = ''
    },
    // 点击登录按钮
    login () {
      // 表单预验证
      this.$refs.loginFromRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        const { data: { data, meta } } = await this.$http.post('login', this.loginFrom)
        console.log(data)
        if (meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        window.sessionStorage.setItem('token', data.token)
        this.$router.push('./home')
      })
    }
  }
}
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
     .login_form {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
      }

      .btns {
        display: flex;
        justify-content: flex-end;
      }

    }
  }
</style>
