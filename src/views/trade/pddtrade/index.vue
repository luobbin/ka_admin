<template>
  <div class="app-container" v-loading="listLoading" element-loading-text="Loading">
    <div class="filter-container" style="margin-bottom:10px;">
      <el-select v-model="searchQuery.field" clearable placeholder="搜索字段" style="width:105px;">
        <el-option v-for="item in fieldOptions" :key="item.key" :label="item.name" :value="item.key"></el-option>
      </el-select>
      :
      <el-input style="width: 150px;" class="filter-item" placeholder="关键字" v-model="searchQuery.keyword" @blur="getUserId"></el-input>
      <el-input style="width: 150px;" class="filter-item" placeholder="会员ID" v-model="searchQuery.uid"></el-input>
      <el-select v-model="searchQuery.order_status" clearable placeholder="订单状态" style="width:105px;">
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.name" :value="item.key"></el-option>
      </el-select>
      <el-button type="primary" class="filter-item" icon="el-icon-search" @click="handleFilter">筛选</el-button>

      <el-button class="filter-item" @click="handleCreate" type="primary" icon="el-icon-edit">添加</el-button>
      <!-- <router-link :to="'/goods/goodslist-reycle'">
        <el-button type="text">【回收站】</el-button>
      </router-link> -->
      
    </div>
    <el-table size="small" ref="multipleTable" :data="list" @selection-change="handleSelectionChange" border fit highlight-current-row>
      <el-table-column type="selection" width="35"></el-table-column>
      <el-table-column prop="order_sn" label="推广订单编号" width="200">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">
            {{scope.row.order_sn}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="goods_name" label="商品名称">
        <template slot-scope="scope">
          <a :title="scope.row.goods_name">
            {{scope.row.goods_name|titleFilter}}
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="goods_id" label="商品ID" width="110"></el-table-column>
      <el-table-column prop="goods_quantity" label="数量" width="60"></el-table-column>
      <el-table-column prop="goods_price" label="单价(元)" width="70">
        <template slot-scope="scope">{{scope.row.goods_price/100|numFilter}}</template>
      </el-table-column>
      <el-table-column prop="order_amount" label="总额(元)" width="70">
        <template slot-scope="scope">{{scope.row.order_amount/100|numFilter}}</template>
      </el-table-column>
      <el-table-column prop="promotion_rate" label="佣金比例" width="60">
      	<template slot-scope="scope">
	      <span v-if="scope.row.promotion_rate>=250" style="color: red">{{scope.row.promotion_rate/1000}}</span>
	      <span v-else>{{scope.row.promotion_rate/1000}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="promotion_amount" label="佣金(元)" width="60">
      	<template slot-scope="scope">
	      <span v-if="scope.row.promotion_amount>0">{{scope.row.promotion_amount/100|numFilter}}</span>
	      <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column prop="p_id" label="PID" width="90"></el-table-column>
      <el-table-column label="会员" width="100">
        <template slot-scope="scope">
          <a class="link-type">
            {{scope.row.uname}}
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="order_status" label="状态" width="100">
      	<template slot-scope="scope">
          {{scope.row.order_status|statusFilter}}
        </template>
      </el-table-column>
      <el-table-column label="时间" width="200">
        <template slot-scope="scope">
          <span style="color: blue">入库:{{scope.row.create_time}}</span><br>
          <span style="color: green">更改:{{scope.row.update_time}}</span><br>
          <span style="color: orange">生成:{{scope.row.order_create_time|parseTime}}</span><br>
					<span style="color: red" v-if="scope.row.order_verify_time!=null">审核:{{scope.row.order_verify_time|parseTime}}</span>
					<span v-else style="color: red">审核:--</span>
        </template>
      </el-table-column>  
      

      <el-table-column prop="operate" label="操作" width="160">
        <template slot-scope="scope">
          <el-button type="text" @click="handleUpdate(scope.row)">编辑</el-button>
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
	
	<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" size="small" ref="dataForm" :model="temp" label-position="left" label-width="90px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="商品名" prop="goods_name">
          <el-input v-model="temp.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品id" prop="goods_id">
          <el-input v-model="temp.goods_id"></el-input>
        </el-form-item>
        <el-form-item label="订单号" prop="order_sn">
          <el-input v-model="temp.order_sn"></el-input>
        </el-form-item>
        <el-form-item label="单价(元)" prop="goods_price">
          <el-input v-model="temp.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="goods_quantity">
          <el-input v-model="temp.goods_quantity"></el-input>
        </el-form-item>
        <el-form-item label="成交额(元)" prop="order_amount">
          <el-input v-model="temp.order_amount"></el-input>
        </el-form-item>
        <el-form-item label="佣金比例" prop="promotion_rate">
          <el-input v-model="temp.promotion_rate" placeholder="即0‰ （数据格式 120 表示120‰）"></el-input>
        </el-form-item>
        <el-form-item label="佣金" prop="promotion_amount">
          <el-input v-model="temp.promotion_amount" placeholder="佣金金额，单位为分"></el-input>
        </el-form-item>
        <el-form-item label="PID" prop="p_id">
          <el-input v-model="temp.p_id"></el-input>
        </el-form-item>
        <el-form-item label="会员名" prop="uname">
          <el-input size="small" v-model="temp.uname"></el-input>
        </el-form-item>
        <el-form-item label="创建时间" prop="order_create_time">
          <el-date-picker size="small" v-model="temp.order_create_time" type="datetime" placeholder="请选择时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="审核时间" prop="order_verify_time">
          <el-date-picker size="small" v-model="temp.order_verify_time" type="datetime" placeholder="请选择时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="成团时间" prop="order_group_success_time">
          <el-date-picker size="small" v-model="temp.order_group_success_time" type="datetime" placeholder="请选择时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="支付时间" prop="order_pay_time">
          <el-date-picker size="small" v-model="temp.order_pay_time" type="datetime" placeholder="请选择时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="订单状态" prop="order_status">
          <el-select size="small" class="filter-item" v-model="temp.order_status">
            <el-option v-for="item in  statusOptions" :key="item.key" :label="item.name" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
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
import { getList,updateData,createData } from '@/api/pddtrade'
import { getUserId} from '@/api/mingxilist'
import { parseTime, parseDate} from '@/utils'

const fieldOptions = [
  { key: 'order_sn', name: '订单号' },
  { key: 'goods_name', name: '商品名' },
  { key: 'goods_id', name: '商品ID' },
  { key: 'uname', name: '会员名' },
  { key: 'uid', name: '会员id' },
  { key: 'p_id', name: 'PID' },
  { key: 'create_time', name: '下单时间' },
]

const statusOptions = [
  { key: -1, name: '订单已失效' },
  { key: 0, name: '订单已支付' },
  { key: 1, name: '订单已成团' },
  { key: 2, name: '订单确认收货' },
  { key: 3, name: '订单审核成功' },
  { key: 4, name: '订单审核失败' },
]

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
        search: '',
        searchFields: '',
        orderBy: 'id',
        sortedBy: 'desc',
        filter: ''
      },
      searchQuery: {
      	search: '',
        searchFields: '',
        field: 'uname',//搜索字段
        keyword: '',//搜索字段对应关键词
        checked: '',//搜索会员状态
        order_status: '',//搜索订单状态
        trade_uid: '',//搜索后六位
        uid:null
      },
      fieldOptions,
      statusOptions,
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
        order_sn: [{ required: true, message: '请输入订单号', trigger: 'blur' }],
        goods_name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        goods_id: [{ required: true, message: '请输入商品ID', trigger: 'blur' }]
      },
    }

  },
  filters: {
    //截取前20位
    titleFilter(str) {
      return str.length>20?str.substring(20)+'...':str
    },
    //截取后六位
    tradeuidFilter(str) {
      return str.substring(str.length-6)
    },
    statusFilter(type) {
      return statusArray[type]
    },
    checkedFilter(type) {
      return checkedArray[type]
    },
    numFilter(value) {
      //截取当前数据到小数点后两位
      let realVal = Number(value).toFixed(2)
      // num.toFixed(2)获取的是字符串
      return Number(realVal)
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
          this.list[i].uname = this.list[i].user == null?'':this.list[i].user.ddusername
        }
        
        this.total = response.data.total
        this.listLoading = false
      })
    },
    //搜索
    handleFilter() {
      //object格式化
      const tempData = Object.assign({}, this.searchQuery)
      console.log(this.searchQuery)
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
      if (tempData.checked) {
        search += 'checked:'+ tempData.checked + ';'
        searchFields += 'checked:=;'
      }
      if (tempData.order_status) {
        search += 'order_status:'+ tempData.order_status + ';'
        searchFields += 'order_status:=;'
      }
      //查询后六位
      if(tempData.trade_uid){
        search += 'trade_id:'+ tempData.trade_uid + ';'
        searchFields += 'trade_id:like;'//'rlike'太慢了    
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
        this.temp = {
          id: arr.id,
          order_sn: arr.order_sn,
          goods_id: arr.goods_id,
          goods_name: arr.goods_name,
          goods_price: arr.goods_price,
          goods_quantity: arr.goods_quantity,
          order_amount: arr.order_amount,
          order_pay_time: arr.order_pay_time==null?null:parseTime(arr.order_pay_time),
          order_create_time: arr.order_create_time==null?null:parseTime(arr.order_create_time),
          promotion_rate: arr.promotion_rate,
          promotion_amount: arr.promotion_amount,
          order_verify_time: arr.order_verify_time==null?null:parseTime(arr.order_verify_time),
          order_group_success_time: arr.order_group_success_time==null?null:parseTime(arr.order_group_success_time),
          uname: arr.user==null?'':arr.user.ddusername,
          p_id: arr.p_id,
          order_status: arr.order_status,
        }
      }else{//创建
        this.temp = {
          id: undefined,
          order_sn: '',
          goods_id: '',
          goods_name: '',
          goods_price: 0,
          goods_quantity: 0,
          order_amount: 0,
          order_pay_time: null,
          order_create_time: null,
          promotion_rate: 0,
          promotion_amount: 0,
          order_verify_time: null,
          order_group_success_time: null,
          uname: '',
          p_id: '',
          order_status: null,
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
          this.temp.order_verify_time = this.temp.order_verify_time==''?null:parseDate(this.temp.order_verify_time)//转时间戳
          this.temp.order_pay_time = this.temp.order_pay_time==''?null:parseDate(this.temp.order_pay_time)//转时间戳
          this.temp.order_create_time = this.temp.order_create_time==''?null:parseDate(this.temp.order_create_time)//转时间戳
          this.temp.order_group_success_time = this.temp.order_group_success_time==''?null:parseDate(this.temp.order_group_success_time)//转时间戳
          createData(this.temp).then(() => {
            this.temp.user = null
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
          this.temp.order_pay_time = this.temp.order_pay_time==''?null:parseDate(this.temp.order_pay_time)//转时间戳
          this.temp.order_create_time = this.temp.order_create_time==''?null:parseDate(this.temp.order_create_time)//转时间戳
          this.temp.order_verify_time = this.temp.order_verify_time==''?null:parseDate(this.temp.order_verify_time)//转时间戳
          this.temp.order_group_success_time = this.temp.order_group_success_time==''?null:parseDate(this.temp.order_group_success_time)//转时间戳
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