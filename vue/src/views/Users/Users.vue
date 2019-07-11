<template>
  <div class="users">
    <!-- 面包屑结构 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框结构 -->
    <div style="margin-top: 15px;">
      <el-input
        placeholder="请输入内容"
        class="input-with-select"
        style="width:300px"
        v-model="query"
        @keyup.13.native="search"
      >
        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
      </el-input>
      <el-button type="primary" @click="addDialogFormVisible=true">添加用户</el-button>
    </div>
    <!-- 表格区域 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="用户名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop="address" label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="putUser(scope.row.id,scope.row.mg_state)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit" @click="editUser(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="修改" placement="top">
            <el-button type="primary" icon="el-icon-share" @click="showRoleUsers(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="primary" icon="el-icon-delete" @click="delUserById(scope.row.id)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 新增弹框 -->
    <el-dialog title="新增用户" :visible.sync="addDialogFormVisible">
      <el-form :model="addUserForm" :label-width="'120px'" :rules="rules" ref="addUserForm">
        <el-form-item label="用户名" prop="username">
          <el-input auto-complete="off" v-model="addUserForm.username" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input auto-complete="off" v-model="addUserForm.password" clearable type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input auto-complete="off" v-model="addUserForm.email" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input
            auto-complete="off"
            v-model="addUserForm.mobile"
            clearable
            @keyup.13.native="addUser"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改弹框 -->
    <el-dialog title="修改角色" :visible.sync="rolesDialogFormVisible">
      <el-form :model="rolesForm" :label-width="'120px'">
        <el-form-item label="用户名">
          <el-input v-model="rolesForm.username" auto-complete="off" disabled style="width:100px"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-select v-model="rolesForm.rid" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rolesDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="roleUsers">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改用户弹框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogFormVisible">
      <el-form :model="editForm" :label-width="'120px'" :rules="rules" ref="editForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserById">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getUsers,
  addUser,
  putUser,
  delUser,
  roleUsers,
  editUser
} from '@/api/user.js'
import { getRolesAll } from '@/api/roles.js'
export default {
  data () {
    return {
      editForm: {
        username: '',
        mobile: '',
        email: '',
        id: ''
      },
      editDialogFormVisible: false,
      value: '',
      options: [],
      rolesForm: {
        id: '',
        rid: '',
        username: '',
        mobile: '',
        email: ''
      },
      rolesDialogFormVisible: false,
      addDialogFormVisible: false,
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 3,
            max: 12,
            message: '密码长度在 3 到 12 个字符',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            pattern: /\w+[@]\w+[.]\w{2,3}/,
            message: '请输入正确邮箱',
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            pattern: /^1[345678]\d{9}$/,
            message: '请输入正确手机号',
            trigger: 'blur'
          }
        ]
      },
      query: '',
      pagenum: 1,
      pagesize: 1,
      total: 0,
      tableData: []
    }
  },
  mounted () {
    this.init()
    getRolesAll()
      .then(res => {
        // console.log(res)
        if (res.data.meta.status === 200) {
          this.options = res.data.data
        }
      })
      .catch(err => {
        console.log(err)
      })
  },
  methods: {
    editUser (row) {
      this.editDialogFormVisible = true
      // console.log(row)
      this.editForm.username = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
      this.editForm.id = row.id
    },
    editUserById () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          editUser(this.editForm)
            .then(res => {
              // console.log(res)
              if (res.data.meta.status === 200) {
                this.$message({
                  type: 'success',
                  message: res.data.meta.msg
                })
                this.editDialogFormVisible = false
                this.init()
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.meta.msg
                })
              }
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          return false
        }
      })
    },
    roleUsers () {
      // console.log(this.rolesForm.rid)
      if (!this.rolesForm.rid) {
        this.$message({
          type: 'error',
          message: '没有选择角色!'
        })
        return false
      }
      roleUsers(this.rolesForm.id, this.rolesForm.rid)
        .then(res => {
          // console.log(res)
          if (res.data.meta.status === 200) {
            this.$message({
              type: 'success',
              message: res.data.meta.msg
            })
            this.rolesDialogFormVisible = false
            // this.rolesForm.rid = ''
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    showRoleUsers (row) {
      this.rolesDialogFormVisible = true
      this.rolesForm.username = row.username
      this.rolesForm.id = row.id
      this.rolesForm.rid = row.rid
    },
    delUserById (id) {
      // console.log(id)
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delUser(id)
            .then(res => {
              // console.log(res)
              if (res.data.meta.status === 200) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.pagenum =
                  Math.ceil((this.total - 1) / this.pagesize) < this.pagenum
                    ? --this.pagenum
                    : this.pagenum
                this.init()
              }
            })
            .catch(error => {
              console.log(error)
              this.$message({
                type: 'error',
                message: '删除失败!'
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    putUser (id, type) {
      // console.log(id, type)
      putUser(id, type)
        .then(res => {
          // console.log(res)
          if (res.data.meta.status === 200) {
            this.$message({
              type: 'success',
              message: res.data.meta.msg
            })
          }
        })
        .catch(err => {
          console.log(err)
          this.$message({
            type: 'error',
            message: '修改失败!'
          })
        })
    },
    addUser () {
      this.$refs.addUserForm.validate(valid => {
        if (valid) {
          // console.log(login);
          addUser(this.addUserForm)
            .then(res => {
              // console.log(res)
              if (res.data.meta.status === 201) {
                this.addDialogFormVisible = false
                // 重置表单内容
                this.$refs.addUserForm.resetFields()
                this.init()
              } else {
                this.$message({
                  message: res.data.meta.msg,
                  type: 'warning'
                })
              }
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          return false
        }
      })
    },
    init () {
      getUsers({
        query: this.query,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      })
        .then(res => {
          // console.log(res)
          this.tableData = res.data.data.users
          this.total = res.data.data.total
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleSizeChange (val) {
      //   console.log(`每页 ${val} 条`)
      //   重置pagesize
      this.pagesize = val
      this.init()
    },
    handleCurrentChange (val) {
      //   console.log(`当前页: ${val}`)
      //   重置pagenum
      this.pagenum = val
      this.init()
    },
    search () {
      this.pagenum = 1
      this.init()
    }
  }
}
</script>
<style lang="less" scoped>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
