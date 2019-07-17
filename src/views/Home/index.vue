<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
     <div>
        <img src="./heima.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click='clear'>退出</el-button>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <!-- 导航栏 -->
        <el-menu background-color="#001529" text-color="#fff" active-text-color="#ffd04b">
        <!-- 一级菜单 -->
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>导航一</span>
          </template>
          <!-- 二级菜单 -->
          <el-menu-item index="1-1">选项1</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data: () => ({
    menus: []
  }),
  created () {
    this.getMenus()
  },
  methods: {
    clear () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenus () {
      const { data: { data, meta } } = await this.$http.get('menus')
      if (meta.status !== 200) return this.$message.error('获取失败')
      console.log(data)
      this.$message.success('获取成功')
    }
  }
}
</script>
<style  lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
