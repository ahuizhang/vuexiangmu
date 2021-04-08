<template>
  <div class="home">
    <el-container>
      <el-aside width="200px">
        <div class="logo"></div>
        <el-menu
          :router="true"
          :default-active="'1'"
          :unique-opened="true"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu :index="frist.id+''" v-for="frist in quanXianList" :key="frist.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{frist.authName}}</span>
            </template>
            <el-menu-item :index="'/home/'+end.path" v-for="end in frist.children" :key="end.id">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{end.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <span class="toggle-btn myicon myicon-menu"></span>
          <h1 class="system-title">后台系统</h1>
          <div class="welcome">
            <span>{{$store.getters.getloginuersname}}</span>
            <a class="welcome">退出</a>
          </div>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { getMenus } from '@/api/roles.js'
export default {
  data () {
    return {
      quanXianList: []
    }
  },
  mounted () {
    getMenus()
      .then(res => {
        // console.log(res)
        if (res.data.meta.status === 200) {
          this.quanXianList = res.data.data
          // console.log(this.quanXianList)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
}
</script>
<style lang="less" scoped>
.home {
  height: 100%;
  .el-menu-admin:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-container {
    height: 100%;
  }
  .el-aside {
    background-color: #545c64;
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #545c64;
  }
  .logo {
    height: 60px;
    background: url(../assets/logo.png);
    background-size: cover;
    background-color: #fff;
  }
  .toggle-btn {
    padding: 0 15px;
    margin-left: -20px;
    font-size: 36px;
    color: white;
    cursor: pointer;
    line-height: 60px;
    &:hover {
      background-color: #4292cf;
    }
  }
  .system-title {
    font-size: 28px;
    color: white;
  }
  .welcome {
    color: white;
  }
}
</style>
