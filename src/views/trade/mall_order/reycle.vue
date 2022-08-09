<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom:10px;">
      <router-link :to="'/trade/mallorder'">
        <el-button type="primary" icon="el-icon-back">返回列表</el-button>
      </router-link>
      
    </div>
    <el-table ref="multipleTable" :data="list" v-loading="listLoading" element-loading-text="Loading" @selection-change="handleSelectionChange" border fit highlight-current-row>
      <el-table-column type="selection" width="35"></el-table-column>
      <el-table-column prop="order_sn" label="订单编号" width="130">
        <template slot-scope="scope">
          <span class="link-type">
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
import { getList,deleteData } from '@/api/mallorder'
import { parseTime, parseDate} from '@/utils'

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
  { key: null, name: '全部订单' },
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
        status: '',//搜索订单状态
        platform: '',//搜索来源
      },
      fieldOptions,
      statusOptions,
      platformOptions,
      multipleSelection: [],
      checkAll: 0,
      isIndeterminate: false,
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