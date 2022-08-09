<template>
  <div class="app-container" v-loading="listLoading" element-loading-text="Loading">
    <div class="filter-container" style="margin-bottom:10px;">
      标题:
      <el-input style="width: 150px;" class="filter-item" placeholder="关键字" v-model="keyword"></el-input>
      <el-button type="primary" class="filter-item" icon="el-icon-search" @click="handleFilter">筛选</el-button>
    </div>
    <el-table ref="multipleTable" :data="list" border fit highlight-current-row>
      <el-table-column type="selection" width="35"></el-table-column>
      <el-table-column prop="id" label="ID" width="120"></el-table-column>
      <el-table-column prop="adtype" label="订单账号" align="center">
      <template slot-scope="scope">
         <el-button class="tag-read" :data-clipboard-text="scope.row.cookie" @click="copy" size="small"  type="primary">{{scope.row.nick}}</el-button>
      </template>
      </el-table-column>
        
      <el-table-column label="最近导入时间"  align="center">
        <template slot-scope="scope">
         {{scope.row.time0}}
        </template>
      </el-table-column>
      <el-table-column label="订单创建" width="200">
        <template slot-scope="scope">
          {{scope.row.num0}}条
        </template>
      </el-table-column>
      <el-table-column label="最近导入时间" width="200">
        <template slot-scope="scope">
          {{scope.row.time1}}
        </template>
      </el-table-column>  
      <el-table-column label="订单结算"  align="center">
        <template slot-scope="scope">
          {{scope.row.num1}}条
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">

      <el-pagination background @current-change="handleCurrentChange" :current-page="listQuery.page"
        :page-sizes="[listQuery.limit]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getList } from '@/api/copycookie'
import { parseTime, parseDate} from '@/utils'
import Clipboard from 'clipboard'
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
      keyword:null,
      multipleSelection: [],
      checkAll: 0,
      isIndeterminate: false,
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
        //console.log(response.data)
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      })
    },
    //复制cookie
    copy() {  
        var clipboard = new Clipboard('.tag-read')  
        clipboard.on('success', e => {  
          alert('复制成功')  
          // 释放内存  
          clipboard.destroy()  
        })  
        clipboard.on('error', e => {  
          // 不支持复制  
          console.log('该浏览器不支持自动复制')  
          // 释放内存  
          clipboard.destroy()  
        })  
      },
    //搜索
    handleFilter() {
      if (this.keyword) {//遵循查询规则
        this.listQuery.search += 'nick:'+ this.keyword +';'
        this.listQuery.searchFields += 'nick:like' + ';'
      }
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
.el-form-item{
	margin-bottom: 10px;
}

</style>