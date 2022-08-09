<template>
  <div class="app-container" v-loading="listLoading" element-loading-text="Loading">
    <div class="filter-container" style="margin-bottom:10px;">
      <el-select v-model="searchQuery.field" clearable placeholder="搜索字段" style="width:105px;">
        <el-option v-for="item in mallsOptions" :key="item.key" :label="item.name" :value="item.key"></el-option>
      </el-select>
      :
      <el-input style="width: 150px;" class="filter-item" placeholder="关键字" v-model="searchQuery.keyword">
      </el-input>
      分类:
      <el-select v-model="searchQuery.cid" clearable placeholder="全部" style="width:105px;">
        <el-option v-for="item in typeOptions" :key="item.id" :label="item.title" :value="item.id"></el-option>
      </el-select>
      <el-button type="primary" class="filter-item" icon="el-icon-search" @click="handleFilter">筛选</el-button>

      <!-- <el-button class="filter-item" type="primary" icon="el-icon-edit">添加</el-button> -->
      <router-link :to="'/goods/mall-reycle'">
        <el-button style="margin-left: 10px" icon="el-icon-delete">回收站</el-button>
      </router-link>
    </div>

    <el-table ref="multipleTable" :data="list" @selection-change="handleSelectionChange" border fit highlight-current-row>
      <el-table-column type="selection" width="35"></el-table-column>
      <el-table-column label="排序" width="60">
        <template slot-scope="scope">
          <span v-if="scope.row.sort>0">{{scope.row.sort}}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="名称" width="110"></el-table-column>
      <el-table-column prop="url" label="网址" align="center"></el-table-column>
      <el-table-column prop="fan" label="最高返" width="80"></el-table-column>
      <el-table-column label="类别" width="90">
        <template slot-scope="scope">
          {{scope.row.type.title}}
        </template>
      </el-table-column>
      <el-table-column label="锁定" width="60">
        <template slot-scope="scope">
          <span v-if="scope.row.suoding==0" style="color: green" title="解锁状态，可被自动或人工更新覆盖信息">否</span>
          <span v-else style="color: red" title="锁定状态，不能自动或人工更新，建议不要锁定">是</span>
        </template>
      </el-table-column>
      <el-table-column label="LOGO" width="180" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.img" width="auto" height="60">
        </template>
      </el-table-column>
      <el-table-column prop="addtime" label="到期时间" width="120">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.edate|parseTime('{y}-{m}-{d}')}}</span>
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
          <!-- <el-button type="text" size="small" style="color: gray">修改</el-button>
          <el-button type="text" size="small">置顶</el-button>
          <el-button type="text" size="small">分享</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-checkbox v-if="checkAll==0" :indeterminate="isIndeterminate" @change="toggleSelection(list)">全选</el-checkbox>
      <el-checkbox v-else-if="checkAll==1" :indeterminate="isIndeterminate" @change="toggleSelection(list)">反选</el-checkbox>
      <el-checkbox v-else  @change="toggleSelection()" :indeterminate="isIndeterminate">取消全选</el-checkbox>
      <el-button type="danger" size="mini" @click="handleDelete()">删除</el-button>

      <el-pagination background @current-change="handleCurrentChange" :current-page="listQuery.page"
        :page-sizes="[listQuery.limit]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
import { getList,updateData,getTypes } from '@/api/mall'
import { parseTime, parseDate } from '@/utils'
const mallsOptions = [
  { key: 'title', name: '名称' },
  { key: 'url', name: '网址' }
]
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
        search: 'del:0;',
        searchFields: 'del:=;',
        orderBy: 'sort',
        sortedBy: 'desc',
        filter: ''
      },
      searchQuery: {
        search: 'del:0;',
        searchFields: 'del:=;',
        field: '',//搜索字段
        keyword: '',//搜索字段对应关键词
        cid: '',//搜索分类
      },
      mallsOptions,
      typeOptions:null,
      multipleSelection: [],
      checkAll: 0,
      isIndeterminate: false
    }

  },
  //添加后重载列表
  created() {
    this.getList()
    this.getTypes()
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
    //获取分类
    getTypes() {
      getTypes().then(response => {
        this.typeOptions = response.data.data
      })
    },
    //搜索
    handleFilter() {
      //object格式化
      const tempData = Object.assign({}, this.searchQuery)
      
      let search = tempData.search
      let searchFields = tempData.searchFields
      if (tempData.field && tempData.keyword) {//遵循查询规则
      	if(tempData.field=='title'){
          search +=  tempData.field +':'+ tempData.keyword +';'
          searchFields += tempData.field +':like' + ';'
      	}else{
          search +=  tempData.field +':'+ tempData.keyword +';'
          searchFields += tempData.field +':=' + ';'
        }
      }
      if (tempData.cid) {
        search += 'cid:'+ tempData.cid + ';'
        searchFields += 'cid:=;'
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
      this.$confirm('此操作将数据移至回收站, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        let ids = ''
        for (const v of this.multipleSelection) {
            ids += v.id + ','
        }

        this.listLoading = true
        updateData({del:1},ids).then(response => {
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