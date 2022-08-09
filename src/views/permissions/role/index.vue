<template>
  <div class="app-container" v-loading="listLoading" element-loading-text="Loading">
    <div class="filter-container" style="margin-bottom:10px">
      <router-link :to="'/permissions/role-create'">
        <el-button type="primary" size="small" icon="el-icon-edit">添加</el-button>
      </router-link>
      <!-- <el-button class="filter-item" style="margin-left: 10px; margin-bottom:10px" @click="handleCreate" type="primary" icon="el-icon-edit">添加</el-button> -->
    </div>
    
    <el-table :data="list" border fit highlight-current-row>
      <el-table-column align="center" label='ID' width="95">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column>
      <el-table-column  label="名称">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="权限" width="110">
        <template slot-scope="scope">
          <span class="link-type" @click='handlePermissions(scope.row.id)'>查看</span>
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
          <router-link :to="'/permissions/role-edit/'+scope.row.id">
            <el-button type="primary" size="small" icon="el-icon-edit">编辑</el-button>
          </router-link>
          <!-- <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button> -->
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

    <el-dialog title="权限列表" :visible.sync="dialogPermissionVisible">
      <el-table :data="permissionData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="name" label="名称"> </el-table-column>
        <el-table-column prop="http_method" label="方法"> </el-table-column>
        <el-table-column prop="http_path" label="路由"> </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPermissionVisible = false">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getList, getPermissions, deleteData } from '@/api/role'

export default {
  data() {
    //初始化默认值
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 15,
        orderBy: 'id',
        sortedBy: 'desc'
      },
      dialogPermissionVisible: false,
      permissionData: [],
    }
  },
  //状态更改后的结果
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  //添加后重载列表
  created() {
    this.getList()
  },
  methods: {
    //获取列表
    getList() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      })
    },
    //更换页面
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    //查看拥有的权限
    handlePermissions(id) {
      getPermissions(id).then(response => {
        this.permissionData = response.data.permissions
        this.dialogPermissionVisible = true
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
  }
}
</script>
