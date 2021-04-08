<template>
  <div class="List">
    <!-- 添加面包屑 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加搜索框 -->
    <el-input
      v-model="goodsForm.query"
      placeholder="请输入内容"
      class="input-with-select"
      style="width:300px"
      @keyup.13.native="init"
    ></el-input>
    <el-button slot="append" icon="el-icon-search" @click="init"></el-button>
    <!-- 添加添加按钮 -->
    <el-button type="primary" @click="$router.push({name:'add'})">添加按钮</el-button>
    <!-- 添加表格 -->
    <el-table :data="goodsData" border style="width: 100%">
      <el-table-column type="index" width="50" label="编号"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="500"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格" width="180"></el-table-column>
      <el-table-column prop="goods_state" label="商品状态"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
      <el-table-column prop="add_time" label="创建时间"></el-table-column>
      <el-table-column label="操作">
        <el-button type="primary" icon="el-icon-edit"></el-button>
        <el-button type="primary" icon="el-icon-delete"></el-button>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="goodsForm.pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="goodsForm.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400"
    ></el-pagination>
  </div>
</template>
<script>
import { getAllGoods } from '@/api/goods.js'
export default {
  data () {
    return {
      total: 0,
      goodsForm: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      goodsData: []
    }
  },
  methods: {
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.goodsForm.pagesize = val
      this.init()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.goodsForm.pagenum = val
      this.init()
    },
    init () {
      getAllGoods(this.goodsForm)
        .then(res => {
          // console.log(res)
          if (res.data.meta.status === 200) {
            this.goodsData = res.data.data.goods
            this.total = res.data.data.total
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang="less" scoped>
</style>
