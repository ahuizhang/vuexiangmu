<template>
  <div class="Add">
    <!-- 添加面包屑 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加步骤条 -->
    <el-steps :active="activeName-0" finish-status="success">
      <el-step title="步骤 1"></el-step>
      <el-step title="步骤 2"></el-step>
      <el-step title="步骤 3"></el-step>
      <el-step title="步骤 3"></el-step>
      <el-step title="步骤 3"></el-step>
    </el-steps>
    <!-- 添加标签页 -->
    <el-form :model="addForm" ref="addGoodForm" label-width="100px">
      <el-tabs v-model="activeName" tab-position="left">
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="addForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="addForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="addForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              :options="options"
              :props="categories"
              clearable
              @change="getCat"
              v-model="addForm.goods_cat"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
        <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <el-upload
            class="upload-demo"
            action="http://localhost:8888/api/private/v1/upload"
            :on-remove="handleRemove"
            :on-success="handsUccess"
            :before-upload="beforeUpload"
            :file-list="fileList"
            list-type="picture"
            :headers="gettoken()"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <quill-editor
            v-model="addForm.goods_introduce"
            ref="myQuillEditor"
            :options="editorOption"
            style="height:400px;border-bottom:1px solid #ccc"
          ></quill-editor>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <div style="text-align:center">
      <el-button type="primary" @click="addGoodsNice">添加按钮</el-button>
    </div>
  </div>
</template>
<script>
import { quillEditor } from 'vue-quill-editor' // 调用编辑器
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { getCategories, addGoods } from '@/api/categories.js'
export default {
  components: {
    quillEditor
  },
  data () {
    return {
      editorOption: {},
      fileList: [],
      categories: {
        checkStrictly: true,
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      options: [],
      activeName: '0',
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: '',
        pics: [],
        goods_introduce: '',
        attrs: []
      }
    }
  },
  methods: {
    getCat (val) {
      this.addForm.goods_cat = val.join()
    },
    // 添加商品
    addGoodsNice () {
      addGoods(this.addForm)
        .then(res => {
          console.log(res)
          if (res.data.meta.status === 201) {
            this.$router.push({ name: 'list' })
          } else {
            this.$message({
              message: '参数不正确',
              type: 'error'
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 上传成功
    handsUccess (response) {
      // console.log(response)
      var imgs = { pic: response.data.tmp_path }
      this.addForm.pics.push(imgs)
    },
    // 上传之前
    beforeUpload (file) {
      console.log(file)
      if (file.type.indexOf('image/') === -1) {
        this.$message({
          message: '格式不正确',
          type: 'error'
        })
        return false
      }
    },
    gettoken () {
      var token = localStorage.getItem('vue_xiangmu_token')
      return { Authorization: token }
    },
    // 移除上传
    handleRemove (file) {
      // console.log(file)
      if (!file.response) {
        return
      }
      this.addForm.pics.forEach((e, i) => {
        if (e.pic === file.response.data.tmp_path) {
          this.addForm.pics.splice(i, 1)
        }
      })
    }
  },
  mounted () {
    getCategories(3)
      .then(res => {
        // console.log(res)
        if (res.data.meta.status === 200) {
          this.options = res.data.data
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
}
</script>
<style lang="less" scoped>
</style>
