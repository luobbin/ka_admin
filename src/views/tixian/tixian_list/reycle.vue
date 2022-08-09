<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom:10px;">
      <router-link :to="'/tixian/tixian-list'">
        <el-button type="primary" icon="el-icon-back">返回列表</el-button>
      </router-link>
      
    </div>
    <el-table ref="multipleTable" :data="list" v-loading="listLoading" element-loading-text="Loading" @selection-change="handleSelectionChange" border fit highlight-current-row>
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
import { getList,deleteData } from '@/api/tixian'
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