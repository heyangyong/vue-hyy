<template>
  <div id="params">
     <!-- 面包屑导航 -->
     <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/params' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert show-icon title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false"></el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader expand-trigger="hover" :options="catelist" v-model="selectedCateKeys" clearable :props="cateProps" @change="handleChange">
          </el-cascader>

           <el-tabs v-model="activeName" @tab-click="handleTabClick">
            <el-tab-pane label="动态参数" name="first">
                <el-button type="primary" >添加参数</el-button>
            </el-tab-pane>
            <el-tab-pane label="静态属性" name="second">
              <el-button type="primary" >添加属性</el-button>
            </el-tab-pane>
          </el-tabs>
        </el-col>

      </el-row>
    </el-card>
  </div>
</template>
<script>
export default {
  data: () => ({
    //  商品分类数据列表
    catelist: [],
    cateProps: {
      value: 'cat_id',
      label: 'cat_name',
      children: 'children'
    },
    selectedCateKeys: [],
    activeName: 'second'
  }),
  created () {
    this.getCates()
  },
  methods: {
    // 获取 商品分类数据列表
    async getCates () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取父级分类数据失败！')
      console.log(res.data)
      this.catelist = res.data
    },
    // 发生改变时
    handleChange () {
      // 证明选中的不是三级分类
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
      }
      console.log(this.selectedCateKeys)
    },
    async getParamsData () {
    },
    // tab栏切换
    handleTabClick (tab, event) {
      // console.log(tab, event)
    }
  }
}
</script>
<style  lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
</style>
