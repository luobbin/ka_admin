<template>
  <div class="app-container" v-loading="listLoading" element-loading-text="Loading">
    <div class="filter-container" style="margin-bottom:10px;">
      <el-select v-model="searchQuery.field" clearable placeholder="搜索字段" style="width:105px;">
        <el-option v-for="item in fieldOptions" :key="item.key" :label="item.name" :value="item.key"></el-option>
      </el-select>
      :
      <el-input style="width: 150px;" class="filter-item" placeholder="关键字" v-model="searchQuery.keyword"></el-input>
      <el-select v-model="searchQuery.status" clearable placeholder="状态" style="width:105px;">
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.name" :value="item.key"></el-option>
      </el-select>
      <el-select v-model="searchQuery.remark" clearable placeholder="类型" style="width:105px;">
        <el-option v-for="item in remarkOptions" :key="item.key" :label="item.name" :value="item.key"></el-option>
      </el-select>
      <el-input style="width: 120px;" class="filter-item" placeholder="最小金额(分)" v-model="searchQuery.min"></el-input>
      -
      <el-input style="width: 120px;" class="filter-item" placeholder="最大金额(分)" v-model="searchQuery.max"></el-input>
      <el-date-picker v-model="searchQuery.month" type="month" placeholder="选择月份">
      </el-date-picker>
      <el-button type="primary" class="filter-item" icon="el-icon-search" @click="handleFilter">筛选</el-button>

      <!-- <el-button class="filter-item" @click="handleCreate" type="primary" icon="el-icon-edit">添加</el-button> -->
      <router-link :to="'/tixian/tixian-reycle'">
        <el-button style="margin-left: 10px" icon="el-icon-delete">回收站</el-button>
      </router-link>
      
    </div>
    <el-table ref="multipleTable" :data="list" @selection-change="handleSelectionChange" border fit highlight-current-row>
      <el-table-column type="selection" width="35"></el-table-column>
      <el-table-column prop="id" label="ID" width="90"></el-table-column>
      <el-table-column label="会员" width="120">
        <template slot-scope="scope">
          <a v-if="scope.row.user != null" class="link-type">
            {{scope.row.user.ddusername}}
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="money" label="提现额(分)" width="90"></el-table-column>
      <el-table-column prop="remark" label="提现类型" width="90">
        <template slot-scope="scope">
            {{scope.row.remark|remarkFilter}}
        </template>
      </el-table-column>
      <el-table-column prop="realname" label="姓名" width="80"></el-table-column>
      <el-table-column prop="code" label="支付宝账号" width="120"></el-table-column>
      <el-table-column prop="mobile" label="手机号" width="120"></el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="light" :content="'原因:'+ scope.row.why" placement="bottom-start">
            <el-tag :type="scope.row.status | statusFilter">{{scope.row.status|statusFilter}}</el-tag>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="时间" width="200">
        <template slot-scope="scope">
          <span style="color: blue">创建:{{scope.row.addtime|parseTime}}</span><br>
          <span style="color: green">更新:{{scope.row.update_time}}</span><br>
          <span v-if="scope.row.dotime!='0'" style="color: red">处理:{{scope.row.dotime|parseTime}}</span>
          <span v-else style="color: red">处理:--</span>
        </template>
      </el-table-column>  
      <el-table-column prop="ip" label="IP"></el-table-column>
      <el-table-column label="金额类型" width="90">
        <template slot-scope="scope">
          <span v-if="scope.row.type==1">集分宝</span>
          <span v-else>商城</span>
        </template>
      </el-table-column>
      <el-table-column prop="operate" label="操作" width="100">
        <template slot-scope="scope">
          <!-- <el-button type="text" v-if="scope.row.status==0" size="mini"><font color="red">禁用</font></el-button>
          <el-button type="text" v-else size="mini">
            <font color="green">退回</font>
          </el-button> -->
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
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="90px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="商品" prop="item_title">
          <el-input size="small" v-model="temp.item_title"></el-input>
        </el-form-item>
        <el-form-item label="店铺" prop="shop_title">
          <el-input size="small" v-model="temp.shop_title"></el-input>
        </el-form-item>
        <el-form-item label="掌柜" prop="seller_nick">
          <el-input size="small" v-model="temp.seller_nick"></el-input>
        </el-form-item>
        <el-form-item label="商品id" prop="num_iid">
          <el-input size="small" v-model="temp.num_iid"></el-input>
        </el-form-item>
        <el-form-item label="订单号" prop="trade_id">
          <el-input size="small" v-model="temp.trade_id"></el-input>
        </el-form-item>
        <el-form-item label="单价(元)" prop="pay_price">
          <el-input size="small" v-model="temp.pay_price"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="item_num">
          <el-input size="small" v-model="temp.item_num"></el-input>
        </el-form-item>
        <el-form-item label="成交额(元)" prop="real_pay_fee">
          <el-input size="small" v-model="temp.real_pay_fe"></el-input>
        </el-form-item>
        <el-form-item label="佣金比例" prop="commission_rate">
          <el-input size="small" v-model="temp.commission_rate" placeholder="即0%  （数据格式 0.12 表示12%）"></el-input>
        </el-form-item>
        <el-form-item label="佣金" prop="commission">
          <el-input size="small" v-model="temp.commission"></el-input>
        </el-form-item>
        <el-form-item label="返利" prop="fxje">
          <el-input size="small" v-model="temp.fxje"></el-input>
        </el-form-item>
        <el-form-item label="集分宝" prop="jifenbao">
          <el-input size="small" v-model="temp.jifenbao"></el-input>
        </el-form-item>
        <el-form-item label="积分" prop="jifen">
          <el-input size="small" v-model="temp.jifen"></el-input>
        </el-form-item>
        <el-form-item label="会员名" prop="uname">
          <el-input size="small" v-model="temp.uname"></el-input>
        </el-form-item>
        <el-form-item label="下单时间" prop="create_time">
          <el-date-picker size="small" v-model="temp.create_time" type="datetime" placeholder="请选择时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结算时间" prop="pay_time">
          <el-date-picker size="small" v-model="temp.pay_time" type="datetime" placeholder="可为空">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="订单状态" prop="status">
          <el-select size="small" class="filter-item" v-model="temp.status">
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
import { getList,updateData } from '@/api/tixian'
import { parseTime, parseDate, getMonthStartDate, getMonthEndDate} from '@/utils'

const fieldOptions = [
  { key: 'code', name: '支付宝账号' },
  { key: 'realname', name: '姓名' },
  { key: 'mobile', name: '手机号' },
  { key: 'why', name: '提现原因' },
  { key: 'uname', name: '会员名' },
  { key: 'uid', name: '会员id' },
]
const remarkOptions = [
  { key: '自动提现', name: '自动提现' },
  { key: 'app提现', name: 'app提现' },
  { key: null, name: '全部' },
]
const statusOptions = [
  { key: 2, name: '提现失败' },
  { key: 0, name: '待审核' },
  { key: 1, name: '提现成功' },
  { key: null, name: '全部' },
]
//将platformOptions对象转换成数组
const remarkArray = remarkOptions.reduce((acc, cur) => {
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
        limit: 15,
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
        field: '',//搜索字段
        keyword: '',//搜索字段对应关键词
        status: '',//搜索订单状态
        remark: '',//搜索来源
        min: 0,//最小额
        max: 0,//最大额
        month: null//parseTime(parseDate(new Date()),'{y}-{m}'),//搜索月份
      },
      fieldOptions,
      statusOptions,
      remarkOptions,
      multipleSelection: [],
      checkAll: 0,
      isIndeterminate: false,
      //初始化行值
      temp: {
        id: undefined,
        item_title: '',
        shop_title: '',
        seller_nick: '',
        num_iid: '',
        pay_price: 0,
        item_num: 0,
        real_pay_fee: 0,
        commission_rate: 0,
        commission: 0,
        fxje: 0,
        jifenbao: 0,
        jifen: 0,
        uname: '',
        create_time: '',
        pay_time: '',
        status: null,
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        order_sn: [{ required: true, message: '请输入订单号', trigger: 'blur' }],
        goods_name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
    }

  },
  filters: {
    //截取前20位
    titleFilter(str) {
      return str.length>10?str.substr(0,20)+'...':str
    },
    statusFilter(type) {
      return statusArray[type]
    },
    remarkFilter(type) {
      return remarkArray[type]
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
      //object格式化
      const tempData = Object.assign({}, this.searchQuery)
      
      let search = tempData.search
      let searchFields = tempData.searchFields
      if (tempData.field && tempData.keyword) {//遵循查询规则
        if(tempData.field=='uname'){//查询会员名
          search += 'user.ddusername:'+ tempData.keyword +';'
          searchFields += 'user.ddusername:=' + ';'
        }else{
          search +=  tempData.field +':'+ tempData.keyword +';'
          searchFields += tempData.field +':=' + ';'
        }
      }
      if (tempData.remark) {
        search += 'remark:'+ tempData.remark + ';'
        searchFields += 'remark:=;'
      }
      if (tempData.status) {
        search += 'status:'+ tempData.status + ';'
        searchFields += 'status:=;'
      }
      if(tempData.min < tempData.max && tempData.min > 0){
        search += 'money:'+ tempData.min +','+ tempData.max + ';'
        searchFields += 'money:between;'
      }
      if(tempData.month){
        this.listQuery.month = parseTime(parseDate(tempData.month),'{y}-{m}')
        let dates = this.listQuery.month.split('-')
        let stime = getMonthStartDate(dates[0],dates[1])
        let etime = getMonthEndDate(dates[0],dates[1])
        search += 'addtime:'+ parseDate(stime) +','+ parseDate(etime) + ';'
        searchFields += 'addtime:between;'
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
	        item_title: '',
	        shop_title: '',
	        seller_nick: '',
	        num_iid: '',
	        pay_price: 0,
	        item_num: 0,
	        real_pay_fee: 0,
	        commission_rate: 0,
	        commission: 0,
	        fxje: 0,
	        jifenbao: 0,
	        jifen: 0,
	        uname: '',
	        create_time: '',
	        pay_time: '',
	        status: null,
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
          createData(this.temp).then(() => {
            this.temp.goods_count = 0
            this.temp.sys = 0
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