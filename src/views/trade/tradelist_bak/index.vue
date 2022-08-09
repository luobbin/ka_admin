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
      <el-date-picker v-model="searchQuery.month" type="month" placeholder="选择月份">
      </el-date-picker>
      <el-button type="primary" class="filter-item" icon="el-icon-search" @click="handleFilter">筛选</el-button>
    </div>
    <el-table size="small" :data="list" border fit highlight-current-row>
      <el-table-column prop="trade_id_former" label="交易号" width="180">
        <template slot-scope="scope">
            {{scope.row.trade_id|formerFilter}}
        </template>
      </el-table-column>
      <el-table-column prop="trade_id" label="后六位" width="70">
        <template slot-scope="scope">
          {{scope.row.trade_id|tradeuidFilter}}
        </template>
      </el-table-column>
      <el-table-column prop="item_title" label="商品名称">
        <template slot-scope="scope">
          <a class="link-type" :href="'http://item.taobao.com/item.html?id='+scope.row.num_iid" target="_blank" :title="scope.row.item_title">
            {{scope.row.item_title|titleFilter}}
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="pay_price" label="单价" width="60"></el-table-column>
      <el-table-column prop="item_num" label="数量" width="60"></el-table-column>
      <el-table-column prop="real_pay_fee" label="成交额" width="70"></el-table-column>
      <el-table-column prop="commission_rate" label="比例" width="60">
        <template slot-scope="scope">
        <span v-if="scope.row.commission_rate>=0.25" style="color: red">{{scope.row.commission_rate|numFilter}}</span>
        <span v-else>{{scope.row.commission_rate|numFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="commission" label="佣金" width="60">
        <template slot-scope="scope">
        <span v-if="scope.row.commission>0">{{scope.row.commission|numFilter}}</span>
        <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column prop="jifenbao" label="集分宝" width="70"></el-table-column>
      <el-table-column prop="pay_time" label="结算时间" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.pay_time!=null"><i class="el-icon-time"></i>{{scope.row.pay_time}}</span>
          <span v-else style="color: gray">未结算</span>
        </template>
      </el-table-column>
      <el-table-column prop="checked" label="认领" width="80">
        <template slot-scope="scope">
          {{scope.row.checked|checkedFilter}}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="80">
      	<template slot-scope="scope">
          {{scope.row.status|statusFilter}}
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="下单时间" width="120">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.create_time}}</span>
        </template>
      </el-table-column>
      <el-table-column label="会员" width="100">
        <template slot-scope="scope">
          <a v-if="scope.row.user != null" class="link-type">
            {{scope.row.user.ddusername}}
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="guanlian" label="淘宝账号"></el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @current-change="handleCurrentChange" :current-page="listQuery.page"
        :page-sizes="[listQuery.limit]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>


  </div>
</template>

<script>
import { getBakList} from '@/api/tradelist'
import { getUserId} from '@/api/mingxilist'
import { parseTime, parseDate} from '@/utils'

const fieldOptions = [
  { key: 'trade_id_former', name: '订单号①' },
  { key: 'trade_id', name: '订单号' },
  { key: 'item_title', name: '商品名' },
  { key: 'num_iid', name: '商品ID' },
  { key: 'uname', name: '会员名' },
  { key: 'uid', name: '会员id' },
  { key: 'jifenbao', name: '集分宝' },
  { key: 'create_time', name: '下单时间' },
]
const checkedOptions = [
  { key: 0, name: '未认领' },
  { key: 1, name: '待审核' },
  { key: 2, name: '已认领' },
  { key: 3, name: '已返现' },
  { key: -1, name: '退款' },
]
const statusOptions = [
  { key: 1, name: '订单创建' },
  { key: 2, name: '订单付款' },
  { key: 3, name: '订单成功' },
  { key: 4, name: '订单失效' },
  { key: 5, name: '订单结算' },
  { key: 6, name: '订单部分退款' },
]
//将checkedOptions对象转换成数组
const checkedArray = checkedOptions.reduce((acc, cur) => {
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
        search: '',
        searchFields: '',
        orderBy: 'id',
        sortedBy: 'desc',
        filter: ''
      },
      searchQuery: {
      	search: '',//初始值
        searchFields: '',//初始值
        status: '',//搜索订单状态
        field: 'uname',//搜索字段
        keyword: '',//搜索字段对应关键词
        uid:null,
        month: parseTime(parseDate(new Date()),'{y}-{m}'),//搜索月份
      },
      fieldOptions,
      statusOptions,
    }

  },
  filters: {
    //截取前20位
    titleFilter(str) {
      return str.length>20?str.substring(20)+'...':str
    },
   //截取后六位
    tradeuidFilter(str) {
      let strs = str.split("_")
      return strs[1]?strs[0].substring(strs[0].length-6):"--";
    },
    //截取“_”之前的数据
    formerFilter(str) {
      let strs = str.split("_")
      return strs[1]?strs[0]:"异常交易号";
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
      getBakList(this.listQuery,this.searchQuery.month).then(response => {
        this.list = response.data.data
        for (var i = this.list.length - 1; i >= 0; i--) {
          this.list[i].top_stime = parseTime(this.list[i].top_stime)
          this.list[i].top_etime = parseTime(this.list[i].top_etime)
        }
        
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
        if(tempData.field!='uname'){
          search +=  tempData.field +':'+ tempData.keyword +';'
          searchFields += tempData.field +':=' + ';'
        }
      }
      if(tempData.uid){//查询会员ID
        search += 'uid:'+ tempData.uid +';'
        searchFields += 'uid:=' + ';'
      }
      if (tempData.status) {
        search += 'status:'+ tempData.status + ';'
        searchFields += 'status:=;'
      }

      this.searchQuery.month = parseTime(parseDate(this.searchQuery.month),'{y}-{m}')
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
    //获取用户id
    getUserId(){
      console.log(this.searchQuery.field)
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

</style>