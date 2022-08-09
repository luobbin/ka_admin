<template>
  <div class="app-container" v-loading="listLoading" element-loading-text="Loading">
    <div class="filter-container" style="margin-bottom:10px;">
      <el-button class="filter-item" style="margin-left: 10px; margin-bottom:10px" @click="handleCreate" type="primary" icon="el-icon-edit">添加</el-button>
    </div>

    <el-table ref="multipleTable" :data="list" @selection-change="handleSelectionChange" border fit highlight-current-row>
      <el-table-column :selectable='checkboxT' type="selection" width="35" disabled='true'></el-table-column>
      <el-table-column prop="id" label="ID" width="60"> </el-table-column>

      <el-table-column prop="pid_name" label="上级分类名" width="100"></el-table-column>
      <el-table-column prop="sub_name" label="名称" ></el-table-column>

      <el-table-column prop="info" label="级别" width="90">
      </el-table-column>
      <el-table-column label="排序" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.sort>0">{{scope.row.sort}}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column prop="operate" label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.pid>0" size="mini" type="danger" @click="deleteData(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-checkbox v-if="checkAll==0" :indeterminate="isIndeterminate" @change="toggleSelection(list)">全选</el-checkbox>
      <el-checkbox v-else-if="checkAll==1" :indeterminate="isIndeterminate" @change="toggleSelection(list)">反选</el-checkbox>
      <el-checkbox v-else  @change="toggleSelection()" :indeterminate="isIndeterminate">取消全选</el-checkbox>
      <el-button type="danger" size="mini" @click="handleDelete()">删除</el-button>
    </div>


    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <div v-if="temp.pid>0">
        <el-form-item label="分类" prop="pid">
          <el-select class="filter-item" v-model="temp.pid" placeholder="请选择分类">
            <el-option v-for="item in  allCates" :key="item.id" :label="item.sub_name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        </div>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="temp.sort"></el-input>
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
import { getList, deleteData, fetchData, createData, updateData, getAllCates } from '@/api/productcate'

export default {
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 15,
        searchJoin: 'and',
        search: '',
        searchFields: '',
        orderBy: 'sort',
        sortedBy: 'desc',
        filter: ''
      },
      multipleSelection: [],
      checkAll: 0,
      isIndeterminate: false,
      temp: {
        id: undefined,
        name: '',
        sub_name: '',
        info: '',
        sort: '',
        cate: [],
        pid:0
      },
      allCates:[],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      dialogPvVisible: false,
      rules: {
        roles: [{ required: true, message: '请选择分类', trigger: 'change' }],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
    }

  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'info',
        2: 'danger'//这个用不到
      }
      return statusMap[status]
    }
  },
  //添加后重载列表
  created() {
    this.getList()
    this.getAllCates()
  },
  methods: {
    //获取角色列表
    getAllCates() {
      getAllCates().then(response => {
        this.allCates = response.data
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
    //更换页面
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    //全选、反选、取消全选
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        });
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    //获取选中对象
    handleSelectionChange(val) {
      this.multipleSelection = val;
      if(this.multipleSelection.length == this.list.length){
        this.checkAll = 2
        this.isIndeterminate = true
      }else if (this.multipleSelection.length > 0) {
        this.checkAll = 1
        this.isIndeterminate = true
      }else{
        this.checkAll = 0
        this.isIndeterminate = false
      }
    },
    //初始化禁用选项
    checkboxT(row,index){
      if(row.pid===0){
        return 0;//禁止
      }else{
        return 1;//开启
      }
    },
    //重置初始化值
    resetTemp(arr) {
      if(arr){
        this.temp = {
          id: arr.id,
          name: arr.name,
          sub_name: arr.sub_name,
          info: arr.info,
          sort: arr.sort,
          cate: arr.cate,
          pid: arr.pid
        }
      }else{
        this.temp = {
          id: undefined,
          name: '',
          sub_name: '',
          info: '',
          sort: '',
          cate: undefined,
          pid:1
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
          createData(this.temp).then(() => {
            for (const r of this.allCates){
              if (r.id === this.temp.pid)
                this.temp.cate = [r]
            }
            this.getList()
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
          const tempData = Object.assign({}, this.temp)
          updateData(tempData,this.temp.id).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                for (const r of this.allCates){
                  if (r.id === this.temp.pid) {
                    this.temp.cate = [r]
                  }
                }
                this.getList()
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
    //单个删除
    deleteData(row) {
      deleteData(row.id).then(() => {
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
    //批量删除
    handleDelete () {
      if(this.multipleSelection.length<=0){
        this.$notify({
          title: '警告',
          message: '请选择要删除的条目',
          type: 'warning'
        });
        return false
      }
      this.$confirm('此操作将数据彻底删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        let ids = ''
        for (const v of this.multipleSelection) {
          if(v.sys==0){
            ids += v.id + ','
          }
        }
        this.listLoading = true
        deleteData(ids).then(response => {
          this.$message({
            type: 'success',
            message: response.data.message
          })
          //重载数据
          this.getList()
          this.listLoading = false
        })

      }).catch(() => {
        //取消后的操作
      })
    }
  }
}
</script>
<style scoped>
.pagination-container{
  margin-top: 10px;
}
.el-pagination{
  float: right;
}

</style>
