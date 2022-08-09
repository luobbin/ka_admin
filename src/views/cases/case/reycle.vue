<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom:10px;">
      <router-link :to="'/articles/article'">
        <el-button type="primary" icon="el-icon-back">返回列表</el-button>
      </router-link>
    </div>

    <el-table ref="multipleTable" :data="list" v-loading="listLoading" element-loading-text="Loading" @selection-change="handleSelectionChange" border fit highlight-current-row>
      <el-table-column type="selection" width="35"></el-table-column>
      <el-table-column prop="id" label="ID" width="60"></el-table-column>
      <el-table-column prop="title" label="标题" align="center"></el-table-column>
      <el-table-column label="栏目" width="120">
        <template slot-scope="scope">
          {{scope.row.type.title}}
        </template>
      </el-table-column>
      <el-table-column label="关键词" width="120" align="center">
        <template slot-scope="scope">
          {{scope.row.keyword}}
        </template>
      </el-table-column>
      <el-table-column prop="hits" label="点击" width="60"></el-table-column>
      
      <el-table-column label="排序" width="60">
        <template slot-scope="scope">
          <span v-if="scope.row.sort>0">{{scope.row.sort}}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column prop="addtime" label="添加时间" width="180">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.addtime|parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="operate" label="操作" width="160">
        <template slot-scope="scope">
          --
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-checkbox v-if="checkAll==0" :indeterminate="isIndeterminate" @change="toggleSelection(list)">全选</el-checkbox>
      <el-checkbox v-else-if="checkAll==1" :indeterminate="isIndeterminate" @change="toggleSelection(list)">反选</el-checkbox>
      <el-checkbox v-else  @change="toggleSelection()" :indeterminate="isIndeterminate">取消全选</el-checkbox>
      <el-button type="danger" size="mini" @click="handleDelete()">彻底删除</el-button>

      <el-pagination background @current-change="handleCurrentChange" :current-page="listQuery.page"
        :page-sizes="[listQuery.limit]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
import { getList,deleteData } from '@/api/article'
import { parseTime, parseDate } from '@/utils'

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
        search: 'del:1;',
        searchFields: 'del:=;',
        orderBy: 'sort',
        sortedBy: 'desc',
        filter: ''
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
      this.$confirm('此操作将彻底删除数据, 是否继续?', '提示', {
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