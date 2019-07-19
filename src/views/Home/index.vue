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
      <el-container>
        <!-- 左侧导航栏 -->
        <el-aside :width="width">
          <div class="toggle-button" @click='toggle'>|||</div>
          <!-- 侧边栏菜单 -->
          <el-menu background-color="#333744" text-color="#fff"
           active-text-color="#409fff" :unique-opened="true" :collapse="iscollapse"
            :collapse-transition="false" router :default-active="active">
             <!-- 一级菜单 -->
            <el-submenu :index="menu.id+''" v-for="menu in menuslist" :key="menu.id">
              <!-- 一级菜单模板区域 -->
              <template slot="title">
                <i :class="iconsObj[menu.id]"></i>
                <span>{{menu.authName}}</span>
              </template>

                <el-menu-item :index="'/'+subMenu.path"  v-for="subMenu in menu.children"
                :key="subMenu.id" @click="saveActive('/'+subMenu.path)">
                  <!-- 二级菜单 -->
                  <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>{{subMenu.authName}}</span>
                  </template>
                </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 右侧内容 -->
        <el-main>
          <!-- 登录后渲染的组件 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
</template>
<script>
export default {
  data () {
    return {
      menuslist: [],
      iconsObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      iscollapse: false,
      active: ''

    }
  },
  created () {
    this.getMenuList()
    this.active = sessionStorage.getItem('active')
  },
  methods: {
    clear () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      // 请求到的数据传给menuslist
      this.menuslist = res.data
    },
    // 切换左侧栏折叠状态
    toggle () {
      this.iscollapse = !this.iscollapse
      // console.log(this.iscollapse)
    },
    // 默认选中项
    saveActive (activePath) {
      sessionStorage.setItem('active', activePath)
    }
  },
  computed: {
    width () {
      // 根据iscollapse修改侧边栏宽度
      return this.iscollapse ? '60px' : '200px'
    }
  }
}
</script>
<style lang="less" scoped>
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
