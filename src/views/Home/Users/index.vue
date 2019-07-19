<template>
  <div id="users">
    <!-- 面包屑导航 -->
     <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="userslist"  style="width: 100%"  border stripe>
          <el-table-column label="姓名" prop="username"></el-table-column>
          <el-table-column label="邮箱" prop="email"></el-table-column>
          <el-table-column label="电话" prop="mobile"></el-table-column>
          <el-table-column label="角色" prop="role_name"></el-table-column>
          <el-table-column label="状态"></el-table-column>
      </el-table>
    </el-card>

  </div>
</template>
<script>
export default {
  data: () => ({
    userslist: [],
    total: 0,
    queryInfo: {
      query: '',
      pagenum: 1,
      pagesize: 2
    }
  }),
  created () {
    this.getUsers()
  },
  methods: {
    // 获取用户列表数据
    async getUsers () {
      const { data: { data, meta } } = await this.$http.get('users', { params: this.queryInfo })
      if (meta.status !== 200) return this.$messgae.error('获取用户列表失败')
      // console.log(data)
      this.userslist = data.users
      console.log(this.userslist)
    }
  }
}
</script>
<style  lang="less" scoped>

</style>
