<template>
  <div class="app-container" v-loading="listLoading" element-loading-text="加载中..">
    <div class="filter-container" style="margin-bottom:10px;">
      发布时间：
      <el-date-picker v-model="searchQuery.publish_day" type="date" placeholder="选择日期">
      </el-date-picker>
      <el-select v-model="searchQuery.is_publish" clearable placeholder="发布状态" style="width:105px;">
        <el-option v-for="item in publishOptions" :key="item.key" :label="item.name" :value="item.key"></el-option>
      </el-select>
      <el-button type="primary" class="filter-item" icon="el-icon-search" @click="handleFilter">筛选</el-button>
      
      <router-link :to="'/community/share_sales-create'">
        <el-button class="filter-item" type="primary" icon="el-icon-edit">添加</el-button>
      </router-link>
    </div>

    <el-table ref="multipleTable" :data="list" @selection-change="handleSelectionChange" border fit highlight-current-row>
      <!-- <el-table-column type="selection" width="35"></el-table-column> -->
      <el-table-column prop="id" label="ID" width="60"></el-table-column>
      <el-table-column label="发布人" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.user!=null">{{scope.row.user.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品">
        <template slot-scope="scope">
          <span v-for="goods in scope.row.goods">
            {{goods.data_id}}:{{goods.open_data|filterTitle}}<br>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="发布状态" width="80" align="center">
        <template slot-scope="scope">
          {{scope.row.is_publish|publishFilter}}
        </template>
      </el-table-column>
      <el-table-column label="发布时间" width="180">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.publish_time|parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人" align="center" width="80">
        <template slot-scope="scope"><span v-if="scope.row.admin!=null">{{scope.row.admin.name}}</span></template>
      </el-table-column>
      <el-table-column label="操作时间" prop="updated_at" width="180"></el-table-column>
      
      <el-table-column prop="operate" label="操作" width="160" align="center">
        <template slot-scope="scope">
          <el-col :span="8">
            <el-button v-if="scope.row.sort>0" type="text" size="small" @click="handleSort(scope.row,0)" title="取消置顶"><font color="green">已置顶</font></el-button>
            <el-button v-else-if="scope.row.sort==0&&scope.row.is_publish>0" type="text" size="small" @click="handleSort(scope.row,1)">
              <font color="black">置顶</font>
            </el-button>
            <div v-else style="color: gray; font-size: 10px; padding-top: 6px;">置顶</div>
          </el-col>
          <el-col :span="5">
            <div v-if="scope.row.is_publish==-1" style="color: gray; font-size: 10px; padding-top: 6px;">修改</div>
            <router-link v-else :to="'/community/share_sales-edit/'+scope.row.id">
              <el-button type="text" size="small">修改</el-button>
            </router-link>
          </el-col>
          <el-button v-if="scope.row.is_publish==2" type="text" size="small" @click="handlePublishStatus(scope.row,-1)"><font color="black">取消发布</font></el-button>
          <el-button v-if="scope.row.is_publish==1" type="text" size="small" @click="handlePublishStatus(scope.row,0)"><font color="black">下架</font></el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <!-- <el-checkbox v-if="checkAll==0" :indeterminate="isIndeterminate" @change="toggleSelection(list)">全选</el-checkbox>
      <el-checkbox v-else-if="checkAll==1" :indeterminate="isIndeterminate" @change="toggleSelection(list)">反选</el-checkbox>
      <el-checkbox v-else  @change="toggleSelection()" :indeterminate="isIndeterminate">取消全选</el-checkbox>
      <el-button type="danger" size="mini" @click="handleDelete()">删除</el-button> -->

      <el-pagination background @current-change="handleCurrentChange" :current-page="listQuery.page"
        :page-sizes="[listQuery.limit]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
import { getList,updateData } from '@/api/share_sales'
import { parseTime, parseDate } from '@/utils'
//1已发布 0已下架 2待发布 -1已取消
const publishOptions = [
  { key: 0, name: '已下架' },
  { key: 1, name: '已发布' },
  { key: 2, name: '待发布' },
  { key: -1, name: '已取消' },
]
//将对象转换成数组
const publishArray = publishOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.name
  return acc
}, {})
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
        orderBy: 'sort,publish_time',
        sortedBy: 'desc',
        filter: ''
      },
      searchQuery: {
        search: '',
        searchFields: '',
        is_publish: '',
        publish_day:null,
      },
      publishOptions,
      multipleSelection: [],
      checkAll: 0,
      isIndeterminate: false
    }

  },
  filters: {
    typeFilter(type) {
      return typeArray[type]
    },
    publishFilter(type) {
      return publishArray[type]
    },
    filterTitle(str){
      if(str==null){
        return "失效商品"
      }else{
        let arr = JSON.parse(str)
        return arr?arr.title:""
      }
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
      
      let search = tempData.search
      let searchFields = tempData.searchFields
      if (tempData.publish_day) {
        let start = parseTime(parseDate(tempData.publish_day),'{y}-{m}-{d} 00:00:00')
        let end = parseTime(parseDate(tempData.publish_day),'{y}-{m}-{d} 23:59:59')
        search += 'publish_time:'+ parseDate(start) + ','+ parseDate(end) + ';'
        searchFields += 'publish_time:between;'
      }
      if (tempData.type) {
        search += 'type:'+ tempData.type + ';'
        searchFields += 'type:=;'
      }
      if (tempData.is_publish) {
        search += 'is_publish:'+ tempData.is_publish + ';'
        searchFields += 'is_publish:=;'
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
    //置顶/取消置顶
    handleSort(row,status){
      updateData({is_sort:status},row.id).then(res => {
        if(res.data.code==200){
          this.$message({
            type: 'success',
            message: "操作成功"
          })
          row.sort = res.data.data
        }else{
          $message(res.data.msg)
        }
      })
    },
    //取消发布、下架
    handlePublishStatus(row, status){
      updateData({is_publish:status},row.id).then(res => {
        if(res.data.code==200){
          this.$message({
            type: 'success',
            message: "操作成功"
          })
          row.is_publish = status
          row.sort = 0
        }else{
          $message(res.data.msg)
        }
      })
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