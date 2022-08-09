<template>
  <div class="app-container" v-loading="listLoading" element-loading-text="Loading">
    <div class="filter-container" style="margin-bottom:10px;">
      <el-select v-model="searchQuery.field" clearable placeholder="搜索字段" style="width:105px;">
        <el-option v-for="item in fieldOptions" :key="item.key" :label="item.name" :value="item.key"></el-option>
      </el-select>
      :
      <el-input style="width: 150px;" class="filter-item" placeholder="关键字" v-model="searchQuery.keyword" @blur="getUserId"></el-input>
      <el-input style="width: 150px;" class="filter-item" placeholder="会员ID" v-model="searchQuery.uid"></el-input>
      <el-select v-model="searchQuery.status" clearable placeholder="订单状态" style="width:105px;">
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.name" :value="item.key"></el-option>
      </el-select>
      <el-select v-model="searchQuery.platform" clearable placeholder="来源" style="width:105px;">
        <el-option v-for="item in platformOptions" :key="item.key" :label="item.name" :value="item.key"></el-option>
      </el-select>
      <el-date-picker v-model="searchQuery.month" type="month" placeholder="选择月份">
      </el-date-picker>
      <el-button type="primary" class="filter-item" icon="el-icon-search" @click="handleFilter">筛选</el-button>

      <el-button class="filter-item" @click="handleCreate" type="primary" icon="el-icon-edit">添加</el-button>
      <router-link :to="'/trade/mallorder-reycle'">
        <el-button style="margin-left: 10px" icon="el-icon-delete">回收站</el-button>
      </router-link>
      
    </div>
    <el-table size="small" ref="multipleTable" :data="list" @selection-change="handleSelectionChange" border fit highlight-current-row>
      <el-table-column type="selection" width="35"></el-table-column>
      <el-table-column label="订单编号" width="130">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">
            {{scope.row.order_code}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="mall_name" label="商城" width="80"></el-table-column>
      <el-table-column label="商品名称">
        <template slot-scope="scope">
          <a class="link-type" v-for="item in scope.row.products" :title="item.name" :href="item.url">
            {{item.name|titleFilter}}<br>
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="product_code" label="商品ID" width="110">
        <template slot-scope="scope">
          <span v-for="item in scope.row.products">
            {{item.code}}<br>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="platform" label="来源" width="70">
        <template slot-scope="scope">
            {{scope.row.platform|platformFilter}}
        </template>
      </el-table-column>
      <el-table-column prop="item_count" label="数量" width="60"></el-table-column>
      <el-table-column prop="item_price" label="单价(元)" width="70"></el-table-column>
      <el-table-column prop="sales" label="总额(元)" width="70"></el-table-column>
      <el-table-column prop="commission" label="佣金" width="60">
      	<template slot-scope="scope">
	      <span v-if="scope.row.commission>0">{{scope.row.commission}}</span>
	      <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column prop="fxje" label="返利" width="60"></el-table-column>
      <el-table-column prop="jifen" label="积分" width="60"></el-table-column>
      <el-table-column label="会员" width="100">
        <template slot-scope="scope">
          <a v-if="scope.row.user != null" class="link-type">
            {{scope.row.user.ddusername}}
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
      	<template slot-scope="scope">
          {{scope.row.status|statusFilter}}
        </template>
      </el-table-column>
      <el-table-column label="时间" width="200">
        <template slot-scope="scope">
          <span style="color: blue">下单:{{scope.row.order_time|parseTime}}</span><br>
          <span style="color: green">更新:{{scope.row.update_time}}</span><br>
          <span v-if="scope.row.pay_time!='0000-00-00'" style="color: red">结算:{{scope.row.pay_time}}</span>
          <span v-else style="color: red">结算:--</span>
        </template>
      </el-table-column>  

      <el-table-column prop="operate" label="操作" width="60">
        <template slot-scope="scope">
          <el-button type="text"  @click="handleUpdate(scope.row)" size="mini">返现</el-button>
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
	
	<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" size="small" ref="dataForm" :model="temp" label-position="left" label-width="90px" style='width: 400px; margin-left:50px;'>
        <div v-if="dialogStatus=='create'">
          <el-form-item label="商城">
            <el-select  v-model="temp.mall_id" clearable placeholder="请选择">
              <el-option v-for="item in mallOptions" :key="item.id" :label="item.title" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联盟">
            <el-select  v-model="temp.lm" clearable placeholder="请选择">
              <el-option v-for="item in lmOptions" :key="item.key" :label="item.name" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单号" prop="order_code">
            <el-input v-model="temp.order_code"></el-input>
          </el-form-item>
          <el-form-item label="商品编号" prop="product_code">
            <el-input v-model="temp.product_code"></el-input>
          </el-form-item>
          <el-form-item label="单价(元)" prop="item_price">
            <el-input v-model="temp.item_price"></el-input>
          </el-form-item>
          <el-form-item label="数量" prop="item_count">
            <el-input v-model="temp.item_count"></el-input>
          </el-form-item>
          <el-form-item label="总额(元)" prop="sales">
            <el-input v-model="temp.sales"></el-input>
          </el-form-item>
          <el-form-item label="佣金" prop="commission">
            <el-input v-model="temp.commission"></el-input>
          </el-form-item>
          <el-form-item label="会员名" prop="uname">
            <el-input v-model="temp.uname"></el-input>
          </el-form-item>
          <el-form-item label="下单时间" prop="order_time">
            <el-date-picker v-model="temp.order_time" type="datetime" placeholder="请选择时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="订单状态" prop="status">
            <el-select class="filter-item" v-model="temp.status">
              <el-option v-for="item in  statusOptions" :key="item.key" :label="item.name" :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div v-else>
          <el-form-item label="商城" prop="mall_name">{{temp.mall_name}}</el-form-item>
          <el-form-item label="联盟">综合联盟</el-form-item>
          <el-form-item label="订单号" prop="order_code">{{temp.order_code}}</el-form-item>
          <el-form-item label="商品编号" prop="product_code">{{temp.product_code}}</el-form-item>
          <el-form-item label="数量" prop="item_count">{{temp.item_count}}</el-form-item>
          <el-form-item label="单价(元)" prop="item_price">{{temp.item_price}}</el-form-item>
          <el-form-item label="总额(元)" prop="sales">{{temp.sales}}</el-form-item>
          <el-form-item label="佣金" prop="commission">
            <el-input v-model="temp.commission"></el-input>
          </el-form-item>
          <el-form-item label="返利" prop="fxje">
            <el-input v-model="temp.fxje"></el-input>
          </el-form-item>
          <el-form-item label="积分" prop="jifen">
            <el-input v-model="temp.jifen"></el-input>
          </el-form-item>
          <el-form-item label="订单状态" prop="status">
            <el-select class="filter-item" v-model="temp.status">
              <el-option v-for="item in  statusOptions" :key="item.key" :label="item.name" :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="会员名" prop="uname">
            <el-input v-if="temp.user==null"v-model="temp.uname"></el-input>
            <el-input v-else v-model="temp.user.ddusername"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">添加</el-button>
        <el-button v-else type="primary" @click="updateData">更新</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getList,updateData,getMalls } from '@/api/mallorder'
import { getUserId} from '@/api/mingxilist'
import { parseTime, parseDate, getMonthStartDate, getMonthEndDate} from '@/utils'

const fieldOptions = [
  { key: 'order_code', name: '订单号' },
  { key: 'title', name: '商品名' },
  { key: 'product_code', name: '商品ID' },
  { key: 'uname', name: '会员名' },
  { key: 'uid', name: '会员id' },
]
const platformOptions = [
  { key: 1, name: '电脑' },
  { key: 2, name: '手机' },
  { key: null, name: '全部' },
]
const statusOptions = [
  { key: -1, name: '订单已失效' },
  { key: 0, name: '订单未确认' },
  { key: 1, name: '订单已确认' },
]
const lmOptions = [
  { key: 8, name: '综合联盟' },
]
//将platformOptions对象转换成数组
const platformArray = platformOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.name
  return acc
}, {})
//将statusOptions对象转换成数组 
const statusArray = statusOptions.reduce((acc, cur) => {
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
        limit: 10,
        searchJoin: 'and',
        search: 'del:0;',
        searchFields: 'del:=;',
        orderBy: 'id',
        sortedBy: 'desc',
        filter: ''
      },
      searchQuery: {
      	search: 'del:0;',
        searchFields: 'del:=;',
        field: 'uname',//搜索字段
        keyword: '',//搜索字段对应关键词
        status: '',//搜索订单状态
        platform: '',//搜索来源
        uid:null,
        month: null//parseTime(parseDate(new Date()),'{y}-{m}'),//搜索月份
      },
      fieldOptions,
      statusOptions,
      platformOptions,
      lmOptions,
      mallOptions:[],
      multipleSelection: [],
      checkAll: 0,
      isIndeterminate: false,
      //初始化行值
      temp: {},
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        order_code: [{ required: true, message: '请输入订单号', trigger: 'blur' }]
      },
    }

  },
  filters: {
    //截取前20位
    titleFilter(str) {
      return str.length>10?str.substr(0,26)+'...':str
    },
    statusFilter(type) {
      return statusArray[type]
    },
    platformFilter(type) {
      return platformArray[type]
    },
  },
  //添加后重载列表
  created() {
    this.getList()
    this.getMalls()
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
    //商城列表
    getMalls() {
      getMalls().then(response => {
        this.mallOptions = response.data
        this.mallOptions.push({0:"请选择"});
      })
    },
    //搜索
    handleFilter() {
      //object格式化
      const tempData = Object.assign({}, this.searchQuery)
      
      let search = tempData.search
      let searchFields = tempData.searchFields
      if (tempData.field && tempData.keyword) {//遵循查询规则
        if(tempData.field!='uname'){
          search +=  tempData.field +':'+ tempData.keyword +';'
          searchFields += tempData.field +':=' + ';'
        }
      }
      if(tempData.uid){//查询会员ID
        search += 'uid:'+ tempData.uid +';'
        searchFields += 'uid:=' + ';'
      }
      if (tempData.platform) {
        search += 'platform:'+ tempData.platform + ';'
        searchFields += 'platform:=;'
      }
      if (tempData.status) {
        search += 'status:'+ tempData.status + ';'
        searchFields += 'status:=;'
      }
      if(tempData.month){
        this.listQuery.month = parseTime(parseDate(tempData.month),'{y}-{m}')
        let dates = this.listQuery.month.split('-')
        let stime = getMonthStartDate(dates[0],dates[1])
        let etime = getMonthEndDate(dates[0],dates[1])
        search += 'order_time:'+ parseDate(stime) +','+ parseDate(etime) + ';'
        searchFields += 'order_time:between;'
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
    //重置初始化值
    resetTemp(arr) {
      if(arr){//更新
        this.temp = arr
      }else{//创建
        this.temp = {
          id: undefined,
	        mall_id: null,
          lm: 8,
          order_code: '',
          product_code: '',
          item_price: 0,
          item_count: 0,
          sales: 0,
          commission: 0,
          fxje: 0,
          jifen: 0,
          uname: '',
          order_time: '',
          status: 0,
          user: null,
        }
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.order_time = this.temp.order_time==''?null:parseDate(this.temp.order_time)//转时间戳
          createData(this.temp).then(() => {
            this.temp.mall_name = ''
            this.temp.platform = ''
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.resetTemp(row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateData(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    //获取用户id
    getUserId(){
      if(this.searchQuery.field=='uname'&&this.searchQuery.keyword!=''){
        getUserId(this.searchQuery.keyword).then(res => {
          this.searchQuery.uid = res.data
        })
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