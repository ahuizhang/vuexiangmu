<template>
  <div class="quanxian">
    <!-- 设置面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 设置表格 -->
    <el-table :data="quanxianData" border style="width: 100%">
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <el-table-column prop="level" label="层级">
          <!-- 使用过滤器要用自定义模板类的数据源 -->
        <template slot-scope="scope">{{scope.row.level | cengji}}</template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getAllQuanXian } from '@/api/roles.js'
export default {
  data () {
    return {
      quanxianData: []
    }
  },
  mounted () {
    getAllQuanXian('list')
      .then(res => {
        // console.log(res)
        if (res.data.meta.status === 200) {
          this.quanxianData = res.data.data
        }
      })
      .catch(err => {
        console.log(err)
      })
  },
  filters: {
    cengji: function (level) {
      if (level === '0') {
        return '一级'
      } else if (level === '1') {
        return '二级'
      } else if (level === '2') {
        return '三级'
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
