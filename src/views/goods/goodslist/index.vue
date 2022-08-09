<template>
  <div class="app-container" v-loading="listLoading" element-loading-text="Loading">
    <div class="filter-container" style="margin-bottom:10px;">
      板块:
      <el-select v-model="searchQuery.code" clearable placeholder="全部" style="width:105px;">
        <el-option v-for="item in bankuaiOptions" :key="item.code" :label="item.title" :value="item.code"></el-option>
      </el-select>
      类型:
      <el-select v-model="searchQuery.leixing" clearable placeholder="全部商品" style="width:105px;">
        <el-option v-for="item in leixingOptions" :key="item.key" :label="item.name" :value="item.key"></el-option>
      </el-select>
      分类:
      <el-select v-model="searchQuery.cid" clearable placeholder="全部" style="width:105px;">
        <el-option v-for="item in goodstypeOptions" :key="item.id" :label="item.title" :value="item.id"></el-option>
      </el-select>
      <el-select v-model="searchQuery.field" clearable placeholder="搜索字段" style="width:105px;">
        <el-option v-for="item in goodsOptions" :key="item.key" :label="item.name" :value="item.key"></el-option>
      </el-select>
      :
      <el-input style="width: 150px;" class="filter-item" placeholder="关键字" v-model="searchQuery.keyword">
      </el-input>
      会员名 :
      <el-input style="width: 150px;" class="filter-item" placeholder="会员名" v-model="searchQuery.ddusername">
      </el-input>
      <el-button type="primary" class="filter-item" icon="el-icon-search" @click="handleFilter">筛选</el-button>
      <router-link :to="'/goods/goods-create'">
        <el-button <el-button class="filter-item" type="primary" icon="el-icon-edit">添加</el-button>
      </router-link>
      <!-- <el-button type="text">【排序商品】</el-button> -->
      <router-link :to="'/goods/goodslist-reycle'">
        <el-button type="text">【回收站】</el-button>
      </router-link>
      <el-button type="text" @click="deleteBypast"><font color="red">【删过】</font></el-button>
    </div>

    <el-table ref="multipleTable" :data="list" @selection-change="handleSelectionChange" border fit highlight-current-row>
      <el-table-column type="selection" width="35">
      </el-table-column>
      <el-table-column label="置顶"  width="80">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="light" :content="'置顶时间:'+ scope.row.top_stime +' —— '+scope.row.top_etime" placement="bottom-start">
            <span v-if="scope.row.top==1">本版置顶</span>
            <span v-else-if="scope.row.top>1">全局置顶</span>
            <span v-else>--</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="商品名">
        <template slot-scope="scope">
          <router-link :to="'/goods/goods-edit/'+scope.row.id">
            <a class="link-type" target="_blank">
              {{scope.row.title}}
            </a>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="img" label="图片" width="80">
        <template slot-scope="scope">
          <!-- <img :src="scope.row.img"> -->
          <a :href="scope.row.img" target="_blank">
            <span slot="reference">查看</span>
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="bankuai.title" label="板块" width="80">
      </el-table-column>
      <el-table-column prop="type.title" label="分类" width="60">
      </el-table-column>
      <el-table-column prop="price" label="原价" width="60">
      </el-table-column>
      <el-table-column prop="discount_price" label="促销价" width="80">
      </el-table-column>
      <el-table-column prop="user.ddusername" label="报名人" width="80">
      </el-table-column>
      <el-table-column prop="starttime" label="开始时间" width="180">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.starttime|parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="endtime" label="结束时间" width="180">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.endtime|parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="operate" label="操作" width="160">
        <template slot-scope="scope">
          <router-link :to="'/goods/goods-edit/'+scope.row.id"><el-button type="text" size="small">修改</el-button></router-link>
          <el-button type="text" size="small" @click="handleTop(scope.row)"><font color="orange">置顶</font></el-button>
          <el-button type="text" v-if="scope.row.isshare==1" size="mini" @click="handleShareStatus(scope.row,'0')"><font color="red">取消分享</font></el-button>
          <el-button type="text" v-else size="mini" @click="handleShareStatus(scope.row,'1')"><font color="green">分享</font></el-button>
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

    <el-dialog title="设置数据置顶位置和时间" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="dialogTemp" label-position="left" label-width="90px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="置顶位置" prop="top">
          <el-select class="filter-item" v-model="dialogTemp.top" placeholder="Please select">
            <el-option v-for="item in topOptions" :key="item.key" :label="item.name" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" prop="top_stime">
          <el-date-picker v-model="dialogTemp.top_stime" type="datetime" placeholder="Please pick a date">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="top_etime">
          <el-date-picker v-model="dialogTemp.top_etime" type="datetime" placeholder="Please pick a date">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button @click="topData">置顶</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getList,getBankuais,getTypes,updateData,deleteBypast } from '@/api/goodslist'
import { parseTime, parseDate } from '@/utils'
const leixingOptions = [
  { key: 1, name: '已上线' },
  { key: 2, name: '仅预告' }
]
const goodsOptions = [
  { key: 'title', name: '商品名称' },
  { key: 'data_id', name: '商品ID' }
]
const topOptions = [
  { key: 0, name: '无' },
  { key: 1, name: '本版置顶' },
  { key: 2, name: '全局置顶' }
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
        orderBy: 'top',
        sortedBy: 'desc',
        filter: ''
      },
      searchQuery: {
        search: 'del:0;',
        searchFields: 'del:=;',
        field: '',//搜索字段
        keyword: '',//搜索字段对应关键词
        code: '',//搜索板块
        leixing: '',//搜索类型
        cid: '',//搜索分类
        ddusername: '',//搜索会员名
      },
      leixingOptions,
      goodsOptions,
      bankuaiOptions:null,
      goodstypeOptions:null,
      multipleSelection: [],
      checkAll: 0,
      isIndeterminate: false,
      dialogFormVisible: false,
      topOptions,
      dialogTemp: {
        id: undefined,
        top: '',
        top_stime: '',
        top_etime:''
      },
      rules: {
        top: [{ required: true, message: '请选择置顶位置', trigger: 'change' }],
        //top_stime: [{ type: 'date', required: true, message: '请选择开始时间', trigger: 'change' }],
        //top_etime: [{ type: 'date', required: true, message: '请选择结束时间', trigger: 'change' }]
      },
    }

  },
  //添加后重载列表
  created() {
    this.getBankuais()
    this.getTypes()
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
    //获取板块
    getBankuais() {
      getBankuais().then(response => {
        this.bankuaiOptions = response.data.data
      })
    },
    //获取分类
    getTypes() {
      //this.listLoading = true
      getTypes().then(response => {
        this.goodstypeOptions = response.data.data
        //this.listLoading = false
      })
    },
    //搜索
    handleFilter() {
      //object格式化
      const tempData = Object.assign({}, this.searchQuery)
      
      let search = tempData.search
      let searchFields = tempData.searchFields
      if (tempData.field && tempData.keyword) {//遵循查询规则
        search +=  tempData.field +':'+ tempData.keyword +';'
        searchFields += tempData.field +':=' + ';'
      }
      if (tempData.code) {
        search += 'code:'+ tempData.code + ';'
        tempData.searchFields += 'code:=;'
      }
      if (tempData.cid) {
        search += 'cid:'+ tempData.cid + ';'
        searchFields += 'cid:=;'
      }
      if (tempData.ddusername) {
        search += 'user.ddusername:'+ tempData.ddusername + ';'
        searchFields += 'user.ddusername:=;'
      }
      if(tempData.leixing){
        const now = parseDate(new Date())
        if(tempData.leixing == 1){//仅上线
          search += 'starttime:'+ now +';endtime:'+ now + ';'
          searchFields += 'starttime:>=;endtime:<;'
        }
        if(tempData.leixing == 2){//仅预告
          search += 'starttime:'+ now + ';'
          searchFields += 'starttime:>;'
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
    },
    //分享状态修改
    handleShareStatus(row, status){
      updateData({isshare:status},row.id).then(response => {
        this.$message({
          type: 'success',
          message: response.data.message
        })
        row.isshare = status
      })
    },
    //置顶调出
    handleTop(row) {
      this.resetTemp(row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    //执行置顶
    topData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.dialogTemp)
          tempData.top_stime = parseDate(tempData.top_stime)//转时间戳
          tempData.top_etime = parseDate(tempData.top_etime)//转时间戳
          
          updateData(tempData,tempData.id).then(() => {
            for (var i = this.list.length - 1; i >= 0; i--) {
              //重置置顶状态
              if (this.list[i].id === this.dialogTemp.id) {
                this.list[i].top = tempData.top
                this.list[i].top_stime = parseTime(tempData.top_stime)//转日期
                this.list[i].top_etime = parseTime(tempData.top_etime)//转日期
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '置顶成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    //重置初始化值
    resetTemp(arr) {
      this.dialogTemp = {
        id: arr.id,
        top: arr.top,
        top_stime: arr.top_stime,
        top_etime: arr.top_etime
      }
      if(arr.top > 1){
        this.dialogTemp.top = 2
      }  
    },
    //批量删除过去的视频
    deleteBypast () {
      this.$confirm('此操作将已过期的商品彻底删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.listLoading = true
        deleteBypast().then(response => {
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

</style>