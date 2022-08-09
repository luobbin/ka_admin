<template>
  <div class="app-container" v-loading="listLoading" element-loading-text="Loading">
    <div class="filter-container" style="margin-bottom:10px;">
      <router-link :to="'/goods/bankuai-create'">
        <el-button class="filter-item" type="primary" icon="el-icon-edit">添加</el-button>
      </router-link>
      <router-link :to="'/goods/bankuai-reycle'">
        <el-button style="margin-left: 10px" icon="el-icon-delete">回收站</el-button>
      </router-link>
    </div>

    <el-table ref="multipleTable" :data="list" @selection-change="handleSelectionChange" border fit highlight-current-row>
      <el-table-column :selectable='checkboxT' type="selection" width="35" disabled='true'>
      </el-table-column>
      <el-table-column label="排序" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.sort>0">{{scope.row.sort}}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="名称" >
      </el-table-column>
      <el-table-column prop="code" label="标识码" width="90">
      </el-table-column>
      <el-table-column prop="bankuai_tpl" label="列表形式" width="90">
      </el-table-column>
      <el-table-column label="商家报名" width="90">
        <template slot-scope="scope">
          <span v-if="scope.row.baoming==1">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column label="首页推荐" width="90">
        <template slot-scope="scope">
          <span v-if="scope.row.tuijian==1">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column label="分类" width="90">
        <template slot-scope="scope">
          <span v-if="scope.row.fenlei==1">网站分类</span>
          <span v-else>关闭</span>
        </template>
      </el-table-column>
      <el-table-column prop="addtime" label="添加时间" width="180">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.addtime|parseTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="90">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">
            <span v-if="scope.row.status==1">开启</span>
            <span v-else>关闭</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="operate" label="操作" width="180">
        <template slot-scope="scope">
          <router-link :to="'/goods/bankuai-edit/'+scope.row.id">
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

      <el-pagination background @current-change="handleCurrentChange" :current-page="listQuery.page"
        :page-sizes="[listQuery.limit]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
import { getList,updateData } from '@/api/bankuai'
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
        search: 'del:0;',
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
  },
  methods: {
    //获取列表
    getList() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.data.data
        for (var i = this.list.length - 1; i >= 0; i--) {
          this.list[i].top_stime = parseTime(this.list[i].top_stime)
          this.list[i].top_etime = parseTime(this.list[i].top_etime)
        }
        
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
      if(row.sys==0){
        return 1;
      }else{
        return 0;
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
      this.$confirm('此操作将商品移至回收站, 是否继续?', '提示', {
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