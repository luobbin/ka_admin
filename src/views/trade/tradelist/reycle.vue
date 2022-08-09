<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom:10px;">
      <router-link :to="'/trade/trade_list'">
        <el-button type="primary" icon="el-icon-back">返回列表</el-button>
      </router-link>
      
    </div>
    <el-table ref="multipleTable" :data="list" v-loading="listLoading" element-loading-text="Loading" @selection-change="handleSelectionChange" border fit highlight-current-row>
      <el-table-column type="selection" width="35"></el-table-column>
      <el-table-column prop="trade_id_former" label="交易号" width="180">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">
            {{scope.row.trade_id_former}}
          </span>
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
	      <span v-if="scope.row.commission_rate>=0.25" style="color: red">{{scope.row.commission_rate*100}}</span>
	      <span v-else>{{scope.row.commission_rate*100}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="commission" label="佣金" width="60">
      	<template slot-scope="scope">
	      <span v-if="scope.row.commission>0">{{scope.row.commission}}</span>
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
      <el-table-column prop="guanlian" label="淘宝账号" width="150"></el-table-column>
      
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
import { getList,deleteData } from '@/api/tradelist'
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
        limit: 15,
        searchJoin: 'and',
        search: 'del:1;',
        searchFields: 'del:=;',
        orderBy: 'id',
        sortedBy: 'desc',
        filter: ''
      },
      searchQuery: {
      	search: 'del:1;',
        searchFields: 'del:=;',
        field: '',//搜索字段
        keyword: '',//搜索字段对应关键词
        checked: '',//搜索会员状态
        status: '',//搜索订单状态
        trade_uid: '',//搜索后六位
      },
      fieldOptions,
      checkedOptions,
      statusOptions,
      multipleSelection: [],
      checkAll: 0,
      isIndeterminate: false,
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