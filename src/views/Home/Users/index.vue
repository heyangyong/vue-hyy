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
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUsers">
            <el-button slot="append" icon="el-icon-search" @click="getUsers"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="userslist"  style="width: 100%"  border stripe>
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column label="姓名" prop="username"></el-table-column>
          <el-table-column label="邮箱" prop="email"></el-table-column>
          <el-table-column label="电话" prop="mobile"></el-table-column>
          <el-table-column label="角色" prop="role_name"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.mg_state" @change="userState(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180px" >
            <template slot-scope="scope">
              <!-- 编辑 -->
                  <el-button type="primary" size='mini' icon="el-icon-edit" @click="showEditUser(scope.row.id)"></el-button>
                  <!-- 删除 -->
                  <el-button type="danger" size='mini' icon="el-icon-delete" @click="delUser(scope.row.id)"></el-button>
                  <!-- 设置 -->
                  <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                      <el-button type="primary" size='mini' icon="el-icon-setting" @click="setRole(scope.row)"></el-button>
                  </el-tooltip>

             </template>
          </el-table-column>
      </el-table>
      <!-- 添加用户对话框 -->
      <el-dialog  title="添加用户" :visible.sync="addDialogVisible"  width="50%" @close="clearAddFrom">
        <!-- 内容主体 -->
        <el-form :rules="addFromRules" :model="addFrom" ref="addFromRef">
        <!-- 用户名 -->
          <el-form-item prop="username" label="用户名">
            <el-input v-model="addFrom.username"></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password" label="密码">
            <el-input type="password" v-model="addFrom.password"></el-input>
          </el-form-item>
         <!-- 手机号 -->
          <el-form-item prop="mobile" label="手机号">
            <el-input v-model="addFrom.mobile" maxlength="11"></el-input>
          </el-form-item>
          <!-- 邮箱 -->
          <el-form-item prop="email" label="邮箱">
            <el-input v-model="addFrom.email"></el-input>
          </el-form-item>
          </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
              <el-button @click="addDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
      </el-dialog>
        <!-- 编辑用户对话框 -->
      <el-dialog  title="编辑用户" :visible.sync="editDialogVisible" width="50%" @close="clearEditFrom">
          <!-- 内容区域  :rules="editFromRules" :model="editFrom" ref="editFromRef"-->
          <el-form :model="editFrom" ref="editFromRef" :rules="editFromRules">
            <!-- 用户名 -->
            <el-form-item prop="username" label="用户名">
              <el-input v-model="editFrom.username" disabled=""></el-input>
            </el-form-item>
            <!-- 手机号 -->
            <el-form-item prop="mobile" label="手机号" >
              <el-input v-model="editFrom.mobile"  maxlength="11"></el-input>
            </el-form-item>
            <!-- 邮箱 -->
            <el-form-item prop="email" label="邮箱">
              <el-input v-model="editFrom.email"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUser">确 定</el-button>
          </span>
      </el-dialog>
      <!-- 分配角色 -->
      <el-dialog
        title="分配角色" :data="userFrom" :visible.sync="setRoledialogVisible" width="50%" @close="setRoleDialogClosed" >
        <!-- 主体内容 -->
        <!-- 用户名 -->
           <div>
             <p>当前用户名:{{userFrom.username}}</p>
             <p>当前角色:{{userFrom.role_name}}</p>
             <p>分配新角色
               <template>
                <el-select v-model="selectedRoleId" placeholder="请选择">
                  <el-option
                    v-for="item in rolesList"
                    :key="item.id"
                    :label="item.roleName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </template>
             </p>
           </div>
        <!-- 底部按钮 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRoledialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
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
// 验证邮箱的规则
var checkEmail = (rule, value, cb) => {
  // 验证邮箱的正则表达式
  const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

  if (regEmail.test(value)) {
    // 合法的邮箱
    return cb()
  }

  cb(new Error('请输入合法的邮箱'))
}

// 验证手机号的规则
var checkMobile = (rule, value, cb) => {
  // 验证手机号的正则表达式
  const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

  if (regMobile.test(value)) {
    return cb()
  }

  cb(new Error('请输入合法的手机号'))
}
export default {
  data: () => ({
    // 查询到的用户信息
    editFrom: { },
    // 获取到的用户列表
    userslist: [],
    // 所有角色列表
    rolesList: [],
    selectedRoleId: '',
    total: 0,
    queryInfo: {
      query: '',
      // 当前页数
      pagenum: 1,
      // 当前每页显示多少数据
      pagesize: 3
    },
    // 添加提示
    addDialogVisible: false,
    // 修改表单
    editDialogVisible: false,
    // 分配角色
    setRoledialogVisible: false,
    // 添加表单
    addFrom: {
      username: '',
      password: '',
      mobile: '',
      email: ''
    },
    userFrom: {},
    // 添加规则验证
    addFromRules: {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
      ],
      mobile: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { validator: checkMobile, trigger: 'blur' }
      ],
      email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { validator: checkEmail, trigger: 'blur' }
      ]
    },
    // 编辑规则验证
    editFromRules: {
      mobile: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { validator: checkMobile, trigger: 'blur' }
      ],
      email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { validator: checkEmail, trigger: 'blur' }
      ]
    }
  }),
  created () {
    this.getUsers()
  },
  methods: {
    // 获取用户列表数据
    async getUsers () {
      const { data: { data, meta } } = await this.$http.get('users', { params: this.queryInfo })
      if (meta.status !== 200) return this.__proto__.$message.error('获取用户列表失败')
      // console.log(data)
      this.userslist = data.users
      this.total = data.total
      // console.log(this.userslist)
    },
    // 监听pagesize的改变
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUsers()
    },
    // 监听页码值改变
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getUsers()
    },
    // 模糊查询
    async userState (userinfo) {
      console.log(userinfo)
      const { data: { data, meta } } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      console.log(data)
      if (meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$messgae.error(meta.data)
      }
      console.log(meta.msg)
    },
    // 清空添加表单规则验证
    clearAddFrom () {
      this.$refs.addFromRef.resetFields()
    },
    // 清空编辑表单规则验证
    clearEditFrom () {
      this.$refs.editFromRef.resetFields()
    },
    // 添加用户
    addUser () {
      // 表单预校验
      this.$refs.addFromRef.validate(async valid => {
        console.log(valid)
        // 如果校验成功发送请求
        if (!valid) return
        const { data: { res, meta } } = await this.$http.post('users', this.addFrom)
        console.log(res)
        if (meta.status !== 201) return this.__proto__.$message.error('添加失败')
        this.__proto__.$message.error(meta.msg)
        this.addDialogVisible = false
      })
    },
    // 获取点击的用户信息
    async showEditUser (id) {
      console.log(id)
      const { data: { data, meta } } = await this.$http.get('users/' + id)
      if (meta.status !== 200) return this.$messgae.error('查询失败')
      console.log(data)
      this.editFrom = data
      this.editDialogVisible = true
    },
    // 编辑用户信息
    editUser () {
      // 表单预校验
      this.$refs.editFromRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        const { data: { data: res, meta } } = await this.$http.put('users/' + this.editFrom.id, {
          email: this.editFrom.email,
          mobile: this.editFrom.mobile })

        if (meta.status !== 200) return this.__proto__.$message.error('更新用户信息失败')
        console.log(res)
        console.log(meta)
        this.__proto__.$message.success('更新成功')
        this.editDialogVisible = false
        this.getUsers()
      })
    },
    // 删除单个用户信息
    delUser (id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const data = await this.$http.delete('users/' + id)
        console.log(data)
        this.getUsers()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 分配角色模块
    async setRole (user) {
      this.userFrom = user
      const { data: { data: res, meta } } = await this.$http.get('roles')
      if (meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.rolesList = res
      console.log(this.rolesList)

      this.setRoledialogVisible = true
    },
    // 保存角色信息
    async saveRoleInfo () {
      if (!this.selectedRoleId) {
        return this.$message.error('请选择要分配的角色！')
      }
      const {
        data: { data, meta }
      } = await this.$http.put(`users/${this.userFrom.id}/role`, {
        rid: this.selectedRoleId
      })
      if (meta.status !== 200) {
        return this.$message.error('更新角色失败！')
      }
      this.$message.success('更新角色成功！')
      this.getUsers()
      this.setRoleDialogVisible = false
    },
    setRoleDialogClosed () {
      this.selectedRoleId = ''
      this.userInfo = {}
    }
  }
}
</script>
<style  lang="less" scoped>

</style>
