<template>
  <div class="app-container" v-loading="listLoading" element-loading-text="Loading">
    <div class="filter-container" style="margin-bottom:10px;">
      <router-link :to="'/jobs/job-create'">
        <el-button class="filter-item" type="primary" icon="el-icon-edit">添加</el-button>
      </router-link>
    </div>

    <el-table ref="multipleTable" :data="list" @selection-change="handleSelectionChange" border fit highlight-current-row>
      <el-table-column type="selection" width="35"></el-table-column>

      <el-table-column prop="id" label="ID" width="60"></el-table-column>

      <el-table-column label="岗位名称" align="center">
        <template slot-scope="scope">
          <router-link :to="'/jobs/job-edit/'+scope.row.id">
            <span class="link-type">{{scope.row.title}}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column label="工作经验">
        <template slot-scope="scope">
          <span>{{scope.row.jingyan}}</span>
        </template>
      </el-table-column>

      <el-table-column label="学历要求">
        <template slot-scope="scope">
          <span>{{scope.row.demand}}</span>
        </template>
      </el-table-column>

      <el-table-column label="薪资待遇">
        <template slot-scope="scope">
          <span>{{scope.row.salary}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="create_at" label="添加时间" width="180">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.created_at}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="operate" label="操作" width="160" align="center">
        <template slot-scope="scope">
          <router-link :to="'/jobs/job-edit/'+scope.row.id">
            <el-button type="primary" size="small">修改</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-checkbox v-if="checkAll==0" :indeterminate="isIndeterminate" @change="toggleSelection(list)">全选</el-checkbox>
      <el-checkbox v-else-if="checkAll==1" :indeterminate="isIndeterminate" @change="toggleSelection(list)">反选</el-checkbox>
      <el-checkbox v-else  @change="toggleSelection()" :indeterminate="isIndeterminate">取消全选</el-checkbox>
      <el-button type="danger" size="mini" @click="handleDelete()">删除</el-button>
    </div>

  </div>
</template>

<script>
import { getList,deleteData } from '@/api/job'

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
        orderBy: 'id',
        sortedBy: 'desc',
        filter: ''
      },
      searchQuery: {
        search: '',
        searchFields: '',
        field: '',//搜索字段
        keyword: '',//搜索字段对应关键词
      },
      multipleSelection: [],
      checkAll: 0,
      isIndeterminate: false
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
        console.log("获取列表数据",response)
        this.list = response.data
        this.total = response.data.length
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
        search += 'title:'+ tempData.keyword + ';'
        searchFields += 'title:like;'
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
      if(this.multipleSelection.length === this.list.length){
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
            ids += v.id + ','
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
