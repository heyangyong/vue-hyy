<template>
  <div id="roles">
    <!-- 面包屑导航 -->
     <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/roles' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible=true">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表 -->
      <el-table :data="rolesList"  style="width: 100%"  border stripe>
           <!-- 展开列 -->
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-row v-for="(item1,index1) in scope.row.children" :key="item1.id" :class="['vcent','bdbottom',{bdtop:index1==0 }]">
                <!-- 一级权限 -->
                <el-col :span="5">
                  <el-tag closable @close="removeRightByID(scope.row,item1.id)"> {{item1.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 二三级权限 -->
                <el-col :span="19">
                  <!-- 二级权限 -->
                  <el-row :class="['vcent',{bdtop:index2!==0}]" v-for="(item2,index2) in item1.children" :key="item2.id" >
                    <el-col :span="6">
                      <el-tag type="success" closable @close="removeRightByID(scope.row,item2.id)"> {{item2.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <!-- 三级权限 -->
                    <el-col :span="18">
                      <el-tag closable type="warning" :class="[{bdtop:index3!==0}]" v-for="(item3,index3) in item2.children"
                       :key="item3.id" @close="removeRightByID(scope.row,item3.id)">
                        {{item3.authName}}
                      </el-tag>
                    </el-col>
                  </el-row>

                </el-col>
            </el-row>
            </template>
          </el-table-column>

          <!-- 索引列 -->
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column label="角色名称" prop="roleDesc"></el-table-column>
          <el-table-column label="角色描述" prop="roleName"></el-table-column>
          <el-table-column label="操作" width="180px" >
            <template slot-scope="scope">
              <!-- 编辑 -->
                  <el-button type="primary" size='mini' icon="el-icon-edit"></el-button>
                  <!-- 删除 -->
                  <el-button type="danger" size='mini' icon="el-icon-delete"></el-button>
                  <!-- 设置 -->
                  <el-tooltip effect="dark" content="分配权限" placement="top" :enterable="false">
                      <el-button type="warning" size='mini' icon="el-icon-setting" @click="rolesShow(scope.row)"></el-button>
                  </el-tooltip>
             </template>
          </el-table-column>
      </el-table>
    </el-card>
     <el-dialog  title="分配权限" :visible.sync="rolesDialogVisible"  width="50%" @close="setDialogVisible">
        <!-- 树形控件-->
        <!--
        show-checkbox  复选框
        node-key      唯一标识 string
        default-expand-all 默认展开
        default-expanded-keys	默认展开的节点的 key 的数组 -->

        <el-tree :data="rights" :props="treeProps" show-checkbox default-expand-all node-key="id"
          :default-checked-keys="defKeys" ref="treeRef"></el-tree>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
              <el-button @click="rolesDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="allRigths">确 定</el-button>
            </span>
      </el-dialog>
  </div>
</template>
<script>
export default {
  data: () => ({
    // 角色列表数据
    rolesList: [],
    rolesDialogVisible: false,
    // 树形权限列表数据
    // 所有权限的数据
    rights: {},
    // 树形控件的属性绑定对象
    treeProps: {
      children: 'children',
      label: 'authName'
    },
    // 默认选中的节点id数组
    defKeys: [],
    // 当前分配权限的id
    roleId: ''
  }),
  created () {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表数据
    async getRolesList () {
      const { data: { data: res, meta } } = await this.$http.get('roles')
      if (meta.status !== 200) return this.$message.error('获取角色列表失败')
      // console.log(data)
      this.rolesList = res
      // console.log(this.rolesList)
    },
    // 获取树形权限列表数据
    async rolesShow (role) {
      this.roleId = role.id
      // console.log(role)

      const { data: { data: res, meta } } = await this.$http.get('rights/tree')
      if (meta.status !== 200) return this.$message.error('获取权限列表失败')
      // console.log(data)
      this.rights = res
      // console.log(this.rights)
      // 调用递归获取节点id
      this.getLeafKeys(role, this.defKeys)
      this.rolesDialogVisible = true
    },
    // 删除id对应的权限
    async removeRightByID (row, id) {
      try {
        await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const { data: { data, meta } } = await this.$http.delete(`roles/${row.id}/rights/${id}`)
        if (meta.status !== 200) return this.$message.error(meta.msg)
        // 删除成功提示
        this.$message.success('删除成功')
        console.log(data)
        // // 刷新数据
        // this.getRoles()
        row.children = data
      } catch (error) {
        this.$message.info('已经撤销删除')
      }
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到 defKeys 数组中
    getLeafKeys (node, arr) {
      if (!node.children) {
        // 如果节点没有children说明是三级几点  把id push到数组中
        return arr.push(node.id)
      }
      // 否则继续递归
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    // 每次关闭后清空defkeys中的数组元素
    setDialogVisible () {
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allRigths () {
      const keys = [
        // getCheckedKeys返回目前被选中的节点的 key 所组成的数组
        // getHalfCheckedKeys返回目前半选中的节点的 key 所组成的数组
        ...this.$refs.treeRef.getCheckedKeys(),
        this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // console.log(keys)
      const rids = keys.join(',')
      // console.log(allStr)
      const { data: { data: res, meta } } = await this.$http.post(`roles/${this.roleId}/rights`, { rids })
      if (meta.status !== 200) return this.$message.error('分配权限失败')
      console.log(res)
      this.$message.success('分配权限成功')
      this.rolesDialogVisible = false
      this.getRolesList()
    }
  }
}
</script>
<style  lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcent{
  display: flex;
  align-items: center
}
</style>
