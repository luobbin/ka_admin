<template>
  <div class="app-container" v-loading="listLoading" element-loading-text="Loading">
    <div class="filter-container" style="margin-bottom:10px;">
      
      <el-date-picker v-model="searchQuery.stime" type="datetime" placeholder="操作开始时间">
      </el-date-picker>
      -
      <el-date-picker v-model="searchQuery.etime" type="datetime" placeholder="操作结束时间">
      </el-date-picker>

      <el-select clearable style="width: 120px" class="filter-item" v-model="searchQuery.field" placeholder="查询字段">
        <el-option v-for="item in fieldOptions" :key="item.key" :label="item.display_name" :value="item.key">
        </el-option>
      </el-select>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="关键字" v-model="searchQuery.keyword">
      </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>
    
    <el-table :data="list" border fit highlight-current-row>
      <el-table-column align="center" label='ID' width="95">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column>
      <el-table-column  label="管理员">
        <template slot-scope="scope">
          <span>{{scope.row.admin_name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作IP" width="210" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.ip}}</span>
        </template>
      </el-table-column>
      <el-table-column label="模块" width="150" align="center">
        <template slot-scope="scope">
          {{scope.row.mod}}
        </template>
      </el-table-column>
      <el-table-column label="方法" width="150" align="center">
        <template slot-scope="scope">
          {{scope.row.do}}
        </template>
      </el-table-column>

      <el-table-column align="center" prop="addtime" label="操作时间" width="210">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.addtime|parseTime}}</span>
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
import { getList } from '@/api/adminlog'
import { parseTime, parseDate } from '@/utils'
const fieldOptions = [
  { key: 'mod', display_name: '模块' },
  { key: 'admin_name', display_name: '管理员名' }
]
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
        searchJoin: 'and',
        search: '',
        searchFields: '',
        orderBy: 'id',
        sortedBy: 'desc'
      },
      searchQuery: {
        field: '',
        keyword: '',
        stime: '',
        etime: '',
        search: '',
        searchFields: ''
      },
      fieldOptions,
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
    //搜索
    handleFilter() {
      //object格式化
      const tempData = Object.assign({}, this.searchQuery)
      tempData.stime = parseDate(tempData.stime)
      tempData.etime = parseDate(tempData.etime)
      if (tempData.field && tempData.keyword) {//遵循查询规则
        tempData.search +=  tempData.field +':'+ tempData.keyword +';'
        tempData.searchFields += tempData.field +':=' + ';'
      }
      if(tempData.stime || tempData.etime){
        tempData.search += 'addtime:'+ tempData.stime +','+ tempData.etime + ';'
        tempData.searchFields += 'addtime:between;'
      }
      this.listQuery.search = tempData.search
      this.listQuery.searchFields = tempData.searchFields
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
  }
}
</script>
