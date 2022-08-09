<template>
<el-container v-loading="listLoading" element-loading-text="Loading">
  <el-header class="tit">
    查询字段
    <el-select v-model="searchQuery.field" clearable placeholder="搜索字段" style="width:105px;">
      <el-option v-for="item in fieldOptions" :key="item.key" :label="item.name" :value="item.key"></el-option>
    </el-select>
    :
    <el-input style="width: 150px;" class="filter-item" placeholder="关键字" v-model="searchQuery.keyword"></el-input>
    
    <el-button type="primary" class="filter-item" icon="el-icon-search" @click="handleFilter">筛选</el-button>
  </el-header>
    
  <el-main class="main">
    <el-table ref="multipleTable" :data="list" @selection-change="handleSelectionChange" border fit highlight-current-row>
      <el-table-column type="selection" width="35" prop="id"></el-table-column>
      <el-table-column prop="user.id" label="会员"></el-table-column>
      <el-table-column prop="old_name" label="旧姓名"></el-table-column>
      <el-table-column prop="name" label="新姓名"></el-table-column>
      <el-table-column prop="old_account" label="旧帐户"></el-table-column>
      <el-table-column prop="account" label="新账户"></el-table-column>
      <el-table-column prop="operate" label="操作员"></el-table-column>
      <el-table-column prop="create_time" label="修改时间"></el-table-column>
    </el-table>

    <div class="tab_foot">
      <div class="block">
        <el-pagination background @current-change="handleCurrentChange" :current-page="listQuery.page"
          :page-sizes="[listQuery.limit]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>

  </el-main>
</el-container>
</template>

<script>
import { getList } from '@/api/baobeilist'

const fieldOptions = [
  { key: 'name', name: '姓名' },
  { key: 'account', name: '支付宝' },
  { key: 'uname', name: '会员名' },
  { key: 'uid', name: '会员id' },
]
export default {
  name: 'user_eAlipylist',
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
      fieldOptions,
      multipleSelection: [],
      checkAll: 0,
      isIndeterminate: false,
    }

  },
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
    //搜索
    handleFilter() {
      //object格式化
      const tempData = Object.assign({}, this.searchQuery)
      
      let search = tempData.search
      let searchFields = tempData.searchFields
      if (tempData.field && tempData.keyword) {//遵循查询规则
        if(tempData.field=='uname'){//查询会员名
          search += 'user.ddusername:'+ tempData.keyword +';'
          searchFields += 'user.ddusername:=' + ';'
        }else{
          search +=  tempData.field +':'+ tempData.keyword +';'
          searchFields += tempData.field +':=' + ';'
        }
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
    },
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
input {
  padding: 0 10px;
}
.tit {
  margin: 0 auto;
  margin-top:20px; 
}
.main {
  padding: 15px 25px 25px 15px !important;
  .tab_foot {
    width: 100%;
    height: 60px;
    line-height: 60px;
    border: 1px solid #f5f5f5;
    border-top: 0;
    .shanshu {
      display: inline-block;
      margin-left: 15px;
    }
    .block {
      transform:translate(0,20%);
      margin-left:30%;
      display: inline-block;
    }
  }
}
</style>
