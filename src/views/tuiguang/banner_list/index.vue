<template>
  <div class="app-container" v-loading="listLoading" element-loading-text="Loading">
    <div class="filter-container" style="margin-bottom:10px;">
      名称:
      <el-input style="width: 150px;" class="filter-item" placeholder="关键字" v-model="keyword"></el-input>
      <el-select v-model="type" clearable placeholder="全部类别" style="width:105px;">
        <el-option v-for="item in typeOptions" :key="item.key" :label="item.name" :value="item.key"></el-option>
      </el-select>
      <el-button type="primary" class="filter-item" icon="el-icon-search" @click="handleFilter">筛选</el-button>

      <router-link :to="'/tuiguang/banner-create'">
        <el-button class="filter-item" type="primary" icon="el-icon-edit">添加</el-button>
      </router-link>
    </div>
    <el-table ref="multipleTable" :data="list" @selection-change="handleSelectionChange" border fit highlight-current-row>
      <el-table-column type="selection" width="35"></el-table-column>
      <el-table-column prop="id" label="ID" width="50"></el-table-column>
      <el-table-column prop="title" label="名称" align="center"></el-table-column>
      
      <el-table-column label="banner图" align="center">
        <template slot-scope="scope">
          <a v-if="scope.row.url!=''" :href="scope.row.url">
            <img :src="scope.row.img" width="auto" height="80">
          </a>
          <a v-else>
            <img :src="scope.row.img" width="auto" height="80">
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类别" width="160">
        <template slot-scope="scope">
          {{scope.row.type|typeFilter}}
        </template>
      </el-table-column>
      <el-table-column label="端口" width="80">
        <template slot-scope="scope">
          {{scope.row.tag|tagFilter}}
        </template>
      </el-table-column>
      <el-table-column label="商品分类" width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.goodstype!==null">[{{scope.row.goodstype.tag}}]{{scope.row.goodstype.title}}</span>
          <span v-else>--</span>
        </template>
          
      </el-table-column>
      <el-table-column prop="sort" label="排序" width="60"></el-table-column>
      <el-table-column label="时间" width="180">
        <template slot-scope="scope">
          {{scope.row.time|parseTime('{y}-{m}-{d} {h}:{i}')}}
        </template>
      </el-table-column>
        
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/tuiguang/banner-edit/'+scope.row.id">
            <el-button type="primary" size="small">修改</el-button>
          </router-link>
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
import { getList,deleteData } from '@/api/banner'
import { parseTime, parseDate} from '@/utils'
//类别 1.banner 2.返利商城图片 3.首页大图 4.热销商品图片
const typeOptions = [
  { key: 0, name: '未定义' },
  { key: 1, name: 'banner' },
  { key: 2, name: '返利商城图片' },
  { key: 3, name: '首页大图' },
  { key: 4, name: '热销商品图片' },
  { key: 5, name: '精选商品图片' },
  { key: 6, name: '分享注册图片' },
  { key: 7, name: 'WEB首页图片banner' },
  { key: 8, name: 'WEB活动专区banner' },
]
//将对象转换成数组
const typeArray = typeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.name
  return acc
}, {})
//端口
const tagOptions = [
  { key: 0, name: '未定义' },
  { key: 1, name: 'Android' },
  { key: 2, name: 'Ios' },
  { key: 3, name: '公共' },
  { key: 4, name: 'Web' },
]
//将对象转换成数组
const tagArray = tagOptions.reduce((acc, cur) => {
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
        orderBy: 'id',
        sortedBy: 'desc',
        filter: ''
      },
      keyword:null,
      type:null,
      typeOptions,
      tagOptions,
      goodstypeOptions: [],
      multipleSelection: [],
      checkAll: 0,
      isIndeterminate: false,
    }

  },
  filters: {
    typeFilter(type) {
      return typeArray[type]
    },
    tagFilter(type) {
      return tagArray[type]
    },
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
      this.resetSearch()
      if (this.keyword) {//遵循查询规则
        this.listQuery.search += 'title:'+ this.keyword +';'
        this.listQuery.searchFields += 'title:=' + ';'
      }
      if (this.type) {//遵循查询规则
        this.listQuery.search += 'type:'+ this.type +';'
        this.listQuery.searchFields += 'type:=' + ';'
      }
      this.listQuery.page = 1
      this.getList()
    },
    //更换页面
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    //重置初始化搜索值
    resetSearch() {
      this.listQuery.search = ''
      this.listQuery.searchFields = ''
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