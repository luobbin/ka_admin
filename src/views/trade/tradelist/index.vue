<template>
  <div class="app-container" v-loading="listLoading" element-loading-text="Loading">
    <div class="filter-container" style="margin-bottom:10px;">
      <el-input style="width: 100px;" class="filter-item" placeholder="订单后6位" v-model="searchQuery.trade_uid">
      </el-input>
      <el-select v-model="searchQuery.field" clearable placeholder="搜索字段" style="width:105px;">
        <el-option v-for="item in fieldOptions" :key="item.key" :label="item.name" :value="item.key"></el-option>
      </el-select>
      :
      <el-input style="width: 150px;" class="filter-item" placeholder="关键字" v-model="searchQuery.keyword" @blur="getUserId"></el-input>
      <el-input style="width: 150px;" class="filter-item" placeholder="会员ID" v-model="searchQuery.uid"></el-input>
      <el-select v-model="searchQuery.checked" clearable placeholder="订单会员状态" style="width:105px;">
        <el-option v-for="item in checkedOptions" :key="item.key" :label="item.name" :value="item.key"></el-option>
      </el-select>
      <el-select v-model="searchQuery.status" clearable placeholder="订单状态" style="width:105px;">
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.name" :value="item.key"></el-option>
      </el-select>
      <el-button type="primary" class="filter-item" icon="el-icon-search" @click="handleFilter">筛选</el-button>

      <el-button class="filter-item" @click="handleCreate" type="primary" icon="el-icon-edit">添加</el-button>
      <router-link :to="'/trade/tradelist-reycle'">
        <el-button style="margin-left: 10px" icon="el-icon-delete">回收站</el-button>
      </router-link>
      
    </div>
    <el-table ref="multipleTable" size="small" :data="list" @selection-change="handleSelectionChange" border fit highlight-current-row>
      <el-table-column type="selection" width="35"></el-table-column>
      <el-table-column prop="trade_id_former" label="交易号" width="180">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">
            {{scope.row.trade_id|formerFilter}}
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
      <el-table-column prop="guanlian" label="淘宝账号" width="150"></el-table-column>
      <el-table-column prop="operate" label="操作" width="160">
        <template slot-scope="scope">
          <el-button type="text" v-if="scope.row.checked==2" @click="doAction(scope.row,'tuikuan')"><font color="black">退款</font></el-button>
          <el-button type="text" v-else-if="scope.row.checked==3"  @click="doAction(scope.row,'fanxian')"><font color="maroon">结算</font></el-button>
          <el-button type="text" v-else-if="scope.row.checked==0"  @click="doAction(scope.row,'fanxian')"><font color="maroon">返现</font></el-button>
          <el-button type="text" v-else-if="scope.row.checked==-1" @click="handleUpdate(scope.row)"><font color="green">查看</font></el-button>
          <el-button type="text" v-else @click="handleUpdate(scope.row)"><font color="green">编辑</font></el-button>

          <el-button type="text" size="small" @click="handleHuanren(scope.row)"><font color="purple">换</font></el-button>
          <el-button type="text" size="small" @click="doAction(scope.row,'cha')"><font color="orange">查</font></el-button>
          <el-button type="text" size="small" @click="doAction(scope.row,'jiacuo')">加错</el-button>
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
      <el-form :rules="rules" ref="dataForm" size="small" :model="temp" label-position="left" label-width="90px" style='width: 400px; margin-left:50px;'>
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
          <el-input size="small" v-model="temp.real_pay_fee"></el-input>
        </el-form-item>
        <el-form-item label="佣金比例" prop="commission_rate">
          <el-input size="small" v-model="temp.commission_rate" placeholder="即0%  （数据格式 0.12 表示12%）"></el-input>
        </el-form-item>
        <el-form-item label="佣金" prop="commission">
          <el-input size="small" v-model="temp.commission" placeholder="佣金总额，单位(元)"></el-input>
        </el-form-item>
        <el-form-item label="返利" prop="fxje">
          <el-input size="small" v-model="temp.fxje" placeholder="下单会员获得的返利金额，单位(元)"></el-input>
        </el-form-item>
        <el-form-item label="集分宝" prop="jifenbao">
          <el-input size="small" v-model="temp.jifenbao" placeholder="下单会员获得的集分宝，单位(分)"></el-input>
        </el-form-item>
        <el-form-item label="积分" prop="jifen">
          <el-input size="small" v-model="temp.jifen" placeholder="下单会员获得的积分"></el-input>
        </el-form-item>
        <el-form-item label="淘宝账号" prop="guanlian">
          <el-input size="small" v-model="temp.guanlian" placeholder="如：开开心心淘淘啦_免费送优惠券"></el-input>
        </el-form-item>
        <el-form-item label="会员名" prop="uname">
          <el-input size="small" v-if="temp.user==null" v-model="temp.uname"></el-input>
          <el-input size="small" v-else v-model="temp.user.ddusername" readonly></el-input>
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
import { getList,updateData,createData,editData } from '@/api/tradelist'
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
        search: 'del:0;',
        searchFields: 'del:=;',
        orderBy: 'id',
        sortedBy: 'desc',
        filter: 'id;pay_time;item_title;shop_title;num_iid;uid;trade_id;trade_id_former;seller_nick;pay_price;item_num;real_pay_fee;commission_rate;commission;fxje;jifenbao;jifen;create_time;status;checked;guanlian'
      },
      searchQuery: {
        search: 'del:0;',
        searchFields: 'del:=;',
        field: 'uname',//搜索字段
        keyword: '',//搜索字段对应关键词
        checked: '',//搜索会员状态
        status: '',//搜索订单状态
        trade_uid: '',//搜索后六位
        uid:null,
      },
      ddusername: '',//换人时填写的用户名
      fieldOptions,
      checkedOptions,
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
        item_title: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        trade_id: [{ required: true, message: '请输入订单号', trigger: 'blur' }]
      },
    }

  },
  filters: {
    //截取前20位
    titleFilter(str) {
      return str.length>20?str.substr(0,20)+'...':str
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
      if (tempData.status) {
        search += 'status:'+ tempData.status + ';'
        searchFields += 'status:=;'
      }
      //查询后六位
      if(tempData.trade_uid){
      	search += 'trade_id_former:'+ tempData.trade_uid + ';'
      	searchFields += 'trade_id_former:like;'//'rlike'太慢了    
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
          trade_id: '',
          user: null,
          guanlian: '',
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
          this.temp.pay_time = this.temp.pay_time==''?null:parseTime(this.temp.pay_time)//转日期
          this.temp.create_time = this.temp.create_time==''?null:parseTime(this.temp.create_time)//转日期
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
          this.temp.pay_time = this.temp.pay_time==''?null:parseTime(this.temp.pay_time)//转日期
          this.temp.create_time = this.temp.create_time==''?null:parseTime(this.temp.create_time)//转日期
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
    handleHuanren(row) {
      this.$prompt('请输入会员名', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.listLoading = true
        const params = {
          act: 'huanren',
          ddusername: value
        }
        editData(params,row.id).then(response => {
          this.$alert(response.data.message, '结果:')
        })
        this.listLoading = false
      })
    },
    doAction(row,act) {
      this.listLoading = true
      const params = {
        act: act,
      }
      editData(params,row.id).then(response => {
        this.$alert(response.data.message, '结果:')
      })
      this.listLoading = false
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