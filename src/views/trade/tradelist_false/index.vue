<template>
  <div class="app-container" v-loading="listLoading" element-loading-text="Loading">
    <div class="filter-container" style="margin-bottom:10px;">
      <el-input style="width: 150px;" class="filter-item" placeholder="订单号" v-model="searchQuery.keyword">
      </el-input>
       <el-select v-model="searchQuery.cid" clearable placeholder="退款状态" style="width:105px;">
        <el-option v-for="item in typeOptions" :key="item.id" :label="item.title" :value="item.id"></el-option>
      </el-select>
      <el-button type="primary" class="filter-item" icon="el-icon-search" @click="handleFilter">筛选</el-button>
      <el-button type="primary"  class="filter-item" @click="handleLot()">点击批量处理订单</el-button>
        <el-upload
                class="upload-demo"
                ref="upload"
                name="thef"
                accept="application/vnd.ms-excel"

                action="https://other.xfz178.com/admin/v1/trade_false/upload"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :file-list="fileList"
                :auto-upload="false"
                style="display: inline;margin-left: 1rem">
            <el-button slot="trigger" size="small"  type="primary">选取文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>

        </el-upload>
        <!--<form action="http://other.xiaofei178.net/admin/v1/trade_false/upload" method="post" enctype="multipart/form-data">-->
            <!--<label for="file">文件名：</label>-->
            <!--<input type="file" name="thef" id="file"><br>-->
            <!--<input type="submit" name="submit" value="提交">-->
        <!--</form>-->
    </div>

    <el-table size="small" ref="multipleTable" :data="list" @selection-change="handleSelectionChange" border fit highlight-current-row>
      
      <el-table-column label="订单号" align="center">
        <template slot-scope="scope">
          {{scope.row.淘宝订单编号}}
        </template>
      </el-table-column>
    
    <el-table-column label="子订单号" align="center">
        <template slot-scope="scope">
          {{scope.row.淘宝子订单编号}}
        </template>
      </el-table-column>
      <el-table-column label="执行退款时间 " width="100" align="center">
        <template slot-scope="scope">
          {{scope.row.addtime|parseTime('{y}-{m}-{d} {h}:{i}')}}
        </template>
      </el-table-column>

      <el-table-column label="退款状态" width="80" align="center">
        <template slot-scope="scope" v-if="scope.row.退款状态==1">
          成功
        </template>
      </el-table-column>

      <el-table-column label="商品名称" width="250" align="center">
        <template slot-scope="scope">
          {{scope.row.商品名称}}
        </template>
      </el-table-column>
     
      <el-table-column label="维权金额 " width="80" align="center">
        <template slot-scope="scope">
          {{scope.row.维权退款金额}}
        </template>
      </el-table-column>

<el-table-column label="返还佣金"  width="80" align="center">
        <template slot-scope="scope">
          {{scope.row.应返还金额}}
        </template>
      </el-table-column>

<el-table-column label="维权状态"  width="80" align="center">
        <template slot-scope="scope">
          {{scope.row.维权状态}}
        </template>
      </el-table-column>

      
      <el-table-column prop="addtime" label="结算时间" width="150" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.订单结算时间|parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="addtime" label="创建时间" width="150" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.维权创建时间|parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="addtime" label="完成时间" width="150" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.维权完成时间|parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="operate" label="操作" width="100" align="center">
        <template slot-scope="scope" v-if="scope.row.退款状态==0">
          <el-button type="primary" size="mini" @click="handleMoney(scope.row)">执行处理</el-button>
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
import { getTradeFalseList,TradeFalseOne,TradeFalseAll,TradeFalseUpload } from '@/api/tradelist_false'
import { parseTime, parseDate } from '@/utils'
const mallsOptions = [
  
]
export default {
  data() {
    return {

        fileList: [],
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        searchJoin: 'and',
        search: '',
        searchFields: '',
        filter: ''
      },
      searchQuery: {
        search: '',
        searchFields: '',
        field: '',//搜索字段
        keyword: '',//搜索字段对应关键词
        cid:''
      },
      oneQuery:{
          order: '',//淘宝订单编号
          sub: ''//子订单编号
      },
      mallsOptions,
      typeOptions:[{id:1,title:'成功'},{id:0,title:'未成功'}],
      multipleSelection: [],
      checkAll: 0,
      isIndeterminate: false
    }

  },
  //添加后重载列表
  created() {
    this.getTradeFalseList()
  },
  methods: {
    //获取列表
    getTradeFalseList() {
      this.listLoading = true
      getTradeFalseList(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      })
    },
      submitUpload() {
          this.$refs.upload.submit()
      },
      handleRemove(file, fileList) {

      },
      handlePreview(file) {

      },
    //处理单个订单
    handleMoney(data){
        this.oneQuery.order = data.淘宝订单编号,
        this.oneQuery.sub = data.淘宝子订单编号,
        TradeFalseOne(this.oneQuery).then(response => {
          this.$message({
            type: 'success',
            message: '执行成功！'
          })
          //重载数据
          this.getTradeFalseList()
          this.listLoading = false
        })
    },

    //处理批量订单
    handleLot(){
         TradeFalseAll().then(response => {
          this.$message({
            type: 'success',
            message: '批量执行成功！'
          })
          //重载数据
          this.getTradeFalseList()
          this.listLoading = false
        })
    },

  
    //搜索
    handleFilter() {
      //object格式化
      const tempData = Object.assign({}, this.searchQuery)
      
      let search = tempData.search
      let searchFields = tempData.searchFields
      if (tempData.keyword) {//遵循查询规则      	
          search += '淘宝订单编号:'+ tempData.keyword + ';'         
          searchFields = '淘宝订单编号:=;'          
        }
      if(tempData.cid>=0){

          search = '退款状态:'+ tempData.cid + ';' 
          searchFields = '退款状态:=;'
      }
      

      this.listQuery.search = search
      this.listQuery.searchFields = searchFields
      this.listQuery.page = 1
      this.getTradeFalseList()
    },
    //更换页面
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getTradeFalseList()
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
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
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
        deleteData(ids).then(response => {
          this.$message({
            type: 'success',
            message: response.data.message
          })
          //重载数据
          this.getTradeFalseList()
          this.listLoading = false
        })
        
      }).catch(() => {
        //取消后的操作
      })
    }
    //添加
    
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