
<template>
  <div class="app-container" v-loading="listLoading" element-loading-text="Loading">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="管理员姓名" v-model="searchQuery.keyword"></el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px; margin-bottom:10px" @click="handleCreate" type="primary" icon="el-icon-edit">添加</el-button>
    </div>

    <el-table :data="list" border fit highlight-current-row>
      <el-table-column align="center" label='ID' width="95">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column>
      <el-table-column  label="姓名">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话" width="110" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.mobile}}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" width="150" align="center">
        <template slot-scope="scope">
          {{scope.row.email}}
        </template>
      </el-table-column>
      <el-table-column label="部门" width="110" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.role[0] !== undefined">
            {{scope.row.role[0].name}}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.created_at}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="updated_at" label="更新时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.updated_at}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.status!='deleted'" size="mini" type="danger" @click="deleteData(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @current-change="handleCurrentChange" :current-page="listQuery.page"
        :page-sizes="[listQuery.limit]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="temp.password" :type="pwdType"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="roles">
          <el-select class="filter-item" v-model="temp.roles" placeholder="请选择部门">
            <el-option v-for="item in  calendarRoles" :key="item.key" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="temp.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="temp.email"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">添加</el-button>
        <el-button v-else type="primary" @click="updateData">更新</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getList, createData, updateData, deleteData, getAllRoles } from '@/api/admin'

export default {
  data() {
    //初始化默认值
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 15,
        orderBy: 'id',
        sortedBy: 'desc'
      },
      searchQuery:{
        search: '',
        searchFields: '',
        keyword: '',//搜索字段对应关键词
      },
      temp: {
        id: undefined,
        name: '',
        mobile: '',
        email: '',
        roles:''
      },
      calendarRoles:[],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      dialogPvVisible: false,
      pwdType: 'password',
      rules: {
        roles: [{ required: true, message: '请选择部门', trigger: 'change' }],
        mobile: [{ required: true, message: '请输入电话', trigger: 'blur' }],
        name: [{ required: true, message: '请输入权限名称', trigger: 'blur' }]
      },
    }
  },

  //添加后重载列表
  created() {
    this.getList()
    this.getAllRoles()
    if(this.dialogStatus == 'create'){//创建时密码必填
      this.rules.password = [{ required: true, message: '请输入密码', trigger: 'blur' }]
    }
  },
  methods: {
    //获取角色列表
    getAllRoles() {
      getAllRoles().then(response => {
        this.calendarRoles = response.data.roles
      })
    },
    //获取列表
    getList() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      })
    },
    //搜索
    handleFilter() {
      //object格式化
      const tempData = Object.assign({}, this.searchQuery)

      let search = tempData.search
      let searchFields = tempData.searchFields

      if (tempData.keyword) {
        search += 'name:'+ tempData.keyword + ';'
        searchFields += 'name:like;'
      }
      this.listQuery.search = search
      this.listQuery.searchFields = searchFields
      this.listQuery.page = 1
      this.getList()
    },
    //更换页面
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    //显示成功状态
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    //重置初始化值
    resetTemp(arr) {
      if(arr){
        this.temp = {
          id: arr.id,
          name: arr.name,
          sort: arr.mobile,
          email: arr.email,
          cate_id: arr.role[0] !== undefined?arr.role[0].id:''
        }
      }else{
        this.temp = {
          id: undefined,
          name: '',
          sort: '',
          email: '',
          cate_id:''
        }
      }

    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          //复制确认密码
          if(this.temp.password){
            this.temp.password_confirmation = this.temp.password
          }
          createData(this.temp).then(() => {
            for (const r of this.calendarRoles){
              if (r.id === this.temp.roles)
                this.temp.role = [r]
            }
            this.temp.created_at = new Date()
            this.temp.updated_at = new Date()
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.resetTemp(row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          //复制确认密码
          if(this.temp.password){
            this.temp.password_confirmation = this.temp.password
          }
          const tempData = Object.assign({}, this.temp)
          updateData(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                for (const r of this.calendarRoles){
                  if (r.id === this.temp.roles)
                    this.temp.role = [r]
                }
                this.temp.created_at = new Date()
                this.temp.updated_at = new Date()
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    deleteData(row) {
      deleteData(row).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      })
    },
  },

  watch: {
    // 如果路由有变化，会再次执行该方法
    "$route": "getList"
  }

}
</script>
