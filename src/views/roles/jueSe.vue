<template>
  <div class="juese">
    <!-- 设置面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加按钮 -->
    <el-button type="primary" @click="addJueSeDialogFormVisible= true">添加角色</el-button>
    <!-- 设置表格 -->
    <el-table :data="jueSeData" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row
            v-for="frist in scope.row.children"
            :key="frist.id"
            style="margin-bottom:10px;border-bottom:1px #ccc dashed"
          >
            <el-col :span="4">
              <el-tag
                closable
                type="success"
                @close="deleteQuanXian(scope.row,frist.id)"
              >{{frist.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row v-for="zhong in frist.children" :key="zhong.id">
                <el-col :span="4">
                  <el-tag
                    closable
                    type="info"
                    @close="deleteQuanXian(scope.row,zhong.id)"
                  >{{frist.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    @close="deleteQuanXian(scope.row,end.id)"
                    closable
                    type="danger"
                    v-for="end in zhong.children"
                    :key="end.id"
                  >{{end.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="scope.row.children.length===0">
            <el-col>请添加权限-----------------------------------------------------------------------------------------------------------</el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="描述" prop="roleDesc"></el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit" @click="showDialogFormVisible(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="修改" placement="top">
            <el-button
              type="primary"
              icon="el-icon-share"
              @click="showQuanXianDialogFormVisible(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="primary" icon="el-icon-delete" @click="deleteRoles(scope.row.id)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 增加权限弹框 -->
    <el-dialog title="新增权限" :visible.sync="quanXianDialogFormVisible">
      <div slot="footer" class="dialog-footer">
        <el-tree
          ref="tree"
          :data="quanXianData"
          show-checkbox
          node-key="id"
          :default-expand-all="true"
          :default-checked-keys="idsArr"
          :props="defaultProps"
        ></el-tree>
        <el-button @click="quanXianDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="shouQuan">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新增弹框 -->
    <el-dialog title="新增角色" :visible.sync="addJueSeDialogFormVisible">
      <el-form :model="addJueSeForm" :label-width="'120px'">
        <el-form-item label="角色名称">
          <el-input v-model="addJueSeForm.roleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addJueSeForm.roleDesc" auto-complete="off" @keyup.13.native="addRoles"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addJueSeDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改弹框 -->
    <el-dialog title="修改角色" :visible.sync="editJueSeDialogFormVisible">
      <el-form :model="eitdForm" :label-width="'120px'">
        <el-form-item label="角色名称">
          <el-input v-model="eitdForm.roleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="eitdForm.roleDesc" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editJueSeDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editJueSe">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getAllJueSe,
  deleteQuanXian,
  getAllQuanXian,
  shouQuan,
  deleteRoles,
  addRoles,
  editJueSe
} from '@/api/roles.js'
export default {
  data () {
    return {
      eitdForm: {
        roleName: '',
        roleDesc: '',
        id: ''
      },
      editJueSeDialogFormVisible: false,
      addJueSeForm: {
        roleName: '',
        roleDesc: ''
      },
      addJueSeDialogFormVisible: false,
      roleId: '',
      idsArr: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      quanXianData: [],
      quanXianDialogFormVisible: false,
      jueSeData: []
    }
  },
  methods: {
    editJueSe () {
      editJueSe(this.eitdForm.id, this.eitdForm.roleName, this.eitdForm.roleDesc)
        .then(res => {
          // console.log(res)
          if (res.data.meta.status === 200) {
            this.$message({
              type: 'success',
              message: res.data.meta.msg
            })
            this.editJueSeDialogFormVisible = false
            this.init()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    showDialogFormVisible (row) {
      this.editJueSeDialogFormVisible = true
      // console.log(row)
      this.eitdForm.roleName = row.roleName
      this.eitdForm.roleDesc = row.roleDesc
      this.eitdForm.id = row.id
    },
    addRoles () {
      this.addJueSeDialogFormVisible = false
      addRoles(this.addJueSeForm)
        .then(res => {
          // console.log(res)
          if (res.data.meta.status === 201) {
            this.$message({
              type: 'success',
              message: res.data.meta.msg
            })
            this.init()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    deleteRoles (id) {
      deleteRoles(id)
        .then(res => {
          // console.log(res)
          if (res.data.meta.status === 200) {
            this.$message({
              type: 'success',
              message: res.data.meta.msg
            })
            this.init()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    shouQuan () {
      // 可以渠道父级id
      // console.log(this.$refs.tree.getCheckedNodes())
      // console.log(this.$refs.tree.getCheckedKeys())
      var arr = this.$refs.tree.getCheckedNodes()
      var temp = []
      for (var i = 0; i < arr.length; i++) {
        temp.push(arr[i].id + ',' + arr[i].pid)
      }
      //   ['109,107,102', '154,107,102']
      console.log(temp)
      //   将temp转换为字符串
      var str = temp.join(',')
      //   '109,107,102,154,107,102'
      console.log(str)
      //   去重：只有数组可以去重
      var arr2 = str.split(',')
      //   [109,107,102, 154,107,102]
      console.log(arr2)
      //   new Set:数组去重 new Set:{109,107,102,154}
      var finalArr = [...new Set(arr2)]
      //   ...可以将对象的成员展开为一个一个值 [109,107,102,154]
      console.log(finalArr)
      shouQuan(this.roleId, finalArr.join(','))
        .then(res => {
          // console.log(res)
          if (res.data.meta.status === 200) {
            this.$message({
              type: 'success',
              message: res.data.meta.msg
            })
            this.quanXianDialogFormVisible = false
            this.init()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    showQuanXianDialogFormVisible (row) {
      this.quanXianDialogFormVisible = true
      // console.log(row)
      this.roleId = row.id
      // console.log(this.roleId)
      getAllQuanXian('tree')
        .then(res => {
          // console.log(res)
          if (res.data.meta.status === 200) {
            this.quanXianData = res.data.data
          }
        })
        .catch(err => {
          console.log(err)
        })
      this.idsArr.length = 0
      row.children.forEach(e => {
        if (e.children && e.children.length > 0) {
          e.children.forEach(v => {
            if (v.children && v.children.length > 0) {
              v.children.forEach(z => {
                this.idsArr.push(z.id)
              })
            }
          })
        }
      })
    },
    deleteQuanXian (row, rightId) {
      deleteQuanXian(row.id, rightId)
        .then(res => {
          // console.log(res)
          if (res.data.meta.status === 200) {
            this.$message({
              type: 'success',
              message: res.data.meta.msg
            })
            row.children = res.data.data
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    init () {
      getAllJueSe()
        .then(res => {
          // console.log(res)
          if (res.data.meta.status === 200) {
            this.jueSeData = res.data.data
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
