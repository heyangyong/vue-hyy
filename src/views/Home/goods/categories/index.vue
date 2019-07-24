<template>
  <div id="cate">
    <!-- 面包屑导航 -->
     <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

     <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- data 数据源
            columns 设置每一列的属性
            ：selection-type="false"关闭复选框
            ：expand-type="false" 关闭缩放效果
            show-index 设置索引
            index-text="#" 自定义索引列的名称
            border 边框
            ：show-row-hover="false"是否有选中高亮 -->
      <tree-table class="tree-table" :data="cateList" :columns="columns"
       :selection-type="false" :expand-type="false" show-index index-text="#" border :show-row-hover="false">
          <template slot="isOK" slot-scope="scope">
              <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
              <i class="el-icon-error" v-else style="color: red;"></i>
          </template>
          <template slot="order" slot-scope="scope">
              <el-tag type="success" v-if="scope.row.cat_level===0">一级</el-tag>
              <el-tag type="warning" v-else-if="scope.row.cat_level===1">二级</el-tag>
              <el-tag type="danger" v-else>三级</el-tag>
          </template>
          <template slot="opt">
              <!-- 编辑 -->
              <el-button type="primary" size='mini' icon="el-icon-edit">编辑</el-button>
              <!-- 删除 -->
              <el-button type="danger" size='mini' icon="el-icon-delete">删除</el-button>
          </template>
      </tree-table>

      <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClose">
      <!-- 添加分类的表单 -->
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- options 用来指定数据源 -->
          <!-- props 用来指定配置对象 -->
          <el-cascader expand-trigger="hover" :options="parentCateList" :props="cascaderProps"
          v-model="selectedKeys"   @change="parentCateChanged" clearable change-on-select>
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
       <!-- 分页 -->
      <!-- handleSizeChange 改变总条数
      handleCurrentChange 前往某一页
      current-page 当前页码 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 7]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data: () => ({
    addCateForm: {
      // 添加分类名称
      cat_name: '',
      // 父分类id
      cat_pid: 0,
      // 分类等级
      cat_level: 0

    },
    addCateDialogVisible: false,
    // 商品分类数据列表
    cateList: [],
    total: 0,
    // 查询条件
    queryInfo: {
      type: 3,
      // 当前页数
      pagenum: 1,
      // 当前每页显示多少数据
      pagesize: 3
    },
    // 为table指定列的定义
    columns: [
      {
        label: '分类名称',
        prop: 'cat_name'
      },
      {
        label: '是否有效',
        // 当前列定义为模板
        type: 'template',
        // 这一列使用的模板名称
        template: 'isOK'
      },
      {
        label: '排序',
        // 当前列定义为模板
        type: 'template',
        // 这一列使用的模板名称
        template: 'order'
      },
      {
        label: '操作',
        // 当前列定义为模板
        type: 'template',
        // 这一列使用的模板名称
        template: 'opt'
      }
    ],
    // 添加分类验证规则
    addCateFormRules: {
      cat_name: [
        { required: true, message: '请输入分类', trigger: 'blur' },
        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
      ]
    },
    // 父级分类的数据列表
    parentCateList: [

    ],
    cascaderProps: {
      value: 'cat_id',
      label: 'cat_name',
      children: 'children'
    },
    // 选中的父级分类的Id数组
    selectedKeys: []
  }),
  created () {
    this.getCate()
  },
  methods: {
    // 获取商品分类数据列表
    async getCate () {
      const { data: { data, meta } } = await this.$http.get('categories', { params: this.queryInfo })
      if (meta.status !== 200) return this.$message.error('获取用户列表失败')
      // console.log(data)
      this.cateList = data.result
      this.total = data.total
      console.log(this.cateList)
      console.log(this.total)
    },
    // 监听pagesize的改变
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCate()
    },
    // 监听页码值改变
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCate()
    },
    // 显示分类对话框
    showAddCateDialog () {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })

      if (res.meta.status !== 200) return this.$message.error('获取父级分类数据失败！')
      console.log(res.data)
      this.parentCateList = res.data
    },
    // 选择项发生变化触发这个函数
    parentCateChanged () {
      console.log(this.selectedKeys)
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys.length
      }
      console.log(this.addCateForm)
    },
    // 重置表单规则
    addCateDialogClose () {
      this.$refs.addCateFormRef.resetFields()
      this.addCateForm.cat_name = ''
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 添加分类
    async addCate () {
      const { data: { data, meta } } = await this.$http.post('categories', this.addCateForm)
      if (meta.status !== 201) return this.$message.error('添加分类失败')
      this.$message.success('添加分类成功')
      this.getCate()
      this.addCateDialogVisible = false
    }
  }
}
</script>
<style  lang="less" scoped>
.tree-table{
  margin:15px 0px;
}
</style>
