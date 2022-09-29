<template>
  <div class="app-container" v-loading="listLoading" element-loading-text="Loading">
    <div class="filter-container" style="margin-bottom:10px;">
      搜索:
      <el-input style="width: 150px;" class="filter-item" placeholder="标题关键字" v-model="searchQuery.keyword">
      </el-input>
      分类:
      <el-select v-model="searchQuery.cate_id" clearable placeholder="全部" style="width:105px;">
        <el-option v-for="item in cateOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <el-button type="primary" class="filter-item" icon="el-icon-search" @click="handleFilter">筛选</el-button>

      <router-link :to="'/cases/case-create'">
        <el-button class="filter-item" type="primary" icon="el-icon-edit">添加</el-button>
      </router-link>
    </div>

    <el-table ref="multipleTable" :data="list" @selection-change="handleSelectionChange" border fit highlight-current-row>
      <el-table-column type="selection" width="35"></el-table-column>
      <el-table-column prop="id" label="ID" width="60"></el-table-column>
      <el-table-column label="名称" align="center">
        <template slot-scope="scope">
          <router-link :to="'/cases/case-edit/'+scope.row.id">
            <span class="link-type">{{scope.row.name}}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="类目" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.cate!==null">{{scope.row.cate.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="首图" width="180" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.index_img" width="auto" height="80">
        </template>
      </el-table-column>
      <el-table-column prop="create_at" label="添加时间" width="180">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.created_at}}</span>
        </template>
      </el-table-column>
      <el-table-column label="首页推荐"  width="80" prop="if_index">
        <template slot-scope="scope">
          <span v-if="scope.row.if_index==1" class="el-tag el-tag--danger">是</span>
          <span v-else class="el-tag">否</span>
        </template>
      </el-table-column>
      <el-table-column label="排序">
        <template slot-scope="scope">
          <span v-if="scope.row.sort>0">{{scope.row.sort}}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>

      <el-table-column prop="operate" label="操作" width="160" align="center">
        <template slot-scope="scope">
          <a :href="'/cases/case-edit/'+scope.row.id" target="_blank">
            <el-button type="primary" size="small">修改</el-button>
          </a>
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
import { getList,deleteData,getTypes } from '@/api/case'

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
        orderBy: 'sort;id',
        sortedBy: 'desc;desc',
        filter: ''
      },
      searchQuery: {
        search: '',
        searchFields: '',
        field: '',//搜索字段
        keyword: '',//搜索字段对应关键词
        cate_id: '',//搜索分类
      },
      cateOptions:null,
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
        //console.log("案例列表",response.data);
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      })
    },
    //获取分类
    getTypes() {
      getTypes().then(response => {
        this.cateOptions = response.data.data
      })
    },
    //搜索
    handleFilter() {
      //object格式化
      const tempData = Object.assign({}, this.searchQuery)

      let search = tempData.search
      let searchFields = tempData.searchFields
      /* if (tempData.field && tempData.keyword) {//遵循查询规则
      	if(tempData.field==='title'){
          search +=  tempData.field +':'+ tempData.keyword +';'
          searchFields += tempData.field +':like' + ';'
      	}else{
          search +=  tempData.field +':'+ tempData.keyword +';'
          searchFields += tempData.field +':=' + ';'
        }
      } */
      if (tempData.keyword) {
        search += 'name:'+ tempData.keyword + ';'
        searchFields += 'name:like;'
      }
      if (tempData.cate_id) {
        search += 'cate_id:'+ tempData.cate_id + ';'
        searchFields += 'cate_id:=;'
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
