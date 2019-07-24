<template>
  <div id="rights">
    <!-- 面包屑导航 -->
     <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/rights' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 权限列表卡片视图 -->
    <el-card>
      <!-- 权限列表  -->
      <el-table :data="rightsList"  style="width: 100%"  border stripe>
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column label="权限名称" prop="authName"></el-table-column>
            <el-table-column label="路径" prop="path"></el-table-column>
            <el-table-column label="权限等级" prop="level">
                <template slot-scope="scope">
                  <el-tag type="success" v-if="scope.row.level==='0'">一级</el-tag>
                  <el-tag type="warning" v-else-if="scope.row.level==='1'">二级</el-tag>
                  <el-tag type="danger" v-else>三级</el-tag>
                </template>
            </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data: () => ({
    // 权限列表数据
    rightsList: []
  }),
  created () {
    this.getList()
  },
  methods: {
    // 获取权限列表数据
    async getList () {
      const { data: { data: res, meta } } = await this.$http.get('rights/list')
      if (meta.status !== 200) return this.$message.error('获取权限列表失败')
      // console.log(data)
      this.rightsList = res
      // console.log(this.rightsList)
    }
  }
}
</script>
<style  lang="less" scoped>
</style>
