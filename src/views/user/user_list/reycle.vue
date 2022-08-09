<template>
  <div class="app-container" v-loading="listLoading" element-loading-text="Loading">
    <div class="filter-container" style="margin-bottom:10px;">
      <router-link :to="'/user/user_list'">
        <el-button type="primary" icon="el-icon-back">返回列表</el-button>
      </router-link>
    </div>

    <el-table ref="multipleTable" :data="list" @selection-change="handleSelectionChange" border fit highlight-current-row>
      <el-table-column type="selection" width="35"></el-table-column>
      <el-table-column label="id" width="70" prop="id" sortable="custom"></el-table-column>
      <el-table-column prop="platform" label="来源" min-width="70">
        <template slot-scope="scope">{{scope.row.platform|platformFilter}}</template>
      </el-table-column>
      <el-table-column prop="ddusername" label="用户名"> </el-table-column>
      <el-table-column prop="tjr" label="推荐ID"> </el-table-column>
      <el-table-column prop="tuijianren.ddusername" label="推荐人用户名" min-width="105"> </el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column label="QQ">
        <template slot-scope="scope">
          <a target="_blank" :href="'http://wpa.qq.com/msgrd?v=3&uin=' + scope.row.qq +'&site=qq&menu=yes'" >
          <img style="height:16px" border="0" src="http://wpa.qq.com/pa?p=2:66666:46" alt="点击这里给我发消息" title="点击这里给我发消息">
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="regtime" label="注册时间" min-width="80"> </el-table-column>
      <el-table-column prop="haoyous_count" label="好友圈" min-width="70"></el-table-column>
      <el-table-column prop="youxiaos_count" label="有效会员" min-width="70"> </el-table-column>
      <el-table-column prop="lastlogintime" label="最近登陆" min-width="80"></el-table-column>
      <el-table-column prop="loginnum" label="登录次数" min-width="86" sortable></el-table-column>
      <el-table-column prop="level" label="购物次数" min-width="86" sortable> </el-table-column>
      <el-table-column prop="money" label="金额" min-width="70" sortable> </el-table-column>
      <el-table-column prop="jifenbao" min-width="82" label="集分宝" sortable> </el-table-column>
      <el-table-column prop="jifen" label="积分" sortable> </el-table-column>
      <el-table-column prop="trade_uid" label="后六位" min-width="75"> </el-table-column>
      <el-table-column label="操作" min-width="175">
          <div slot-scope="scope">
            <el-button type="text" size="small" @click="lookuser(scope.$index,scope.row)">查看</el-button>
            <el-button type="text" size="small" @click="mingxiuser(scope.$index,scope.row)">明细</el-button>
            <el-button type="text" size="small" @click="jiangliuser(scope.$index,scope.row)">奖励</el-button>
            <el-button type="text" size="small" style="color:red" @click="laheiuser(scope.$index,scope.row)">拉黑</el-button>
          </div>
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
  </div>
</template>

<script>
import { getList,deleteData } from '@/api/userlist'
import { parseTime, parseDate } from '@/utils'
const lockOptions = [
  { value: '', label: '全部' }, 
  { value: '1', label: '正常' }, 
  { value: '-1', label: '黑名单'}
]
const platformOptions = [
  { value: '', label: '全部' }, 
  { value: '1', label: '电脑' }, 
  { value: '2', label: '手机'}, 
  { value: '5', label: 'WAP'}, 
  { value: '6', label: '新版QQ'}, 
  { value: '127', label: 'QQ'}, 
  { value: '7', label: '微信机器人'},
  { value: '8', label: '微信公众号'},
  { value: '9', label: '微信小程序'}
]
const fieldOptions = [
  { value: 'ddusername', label: '会员名①'}, 
  { value: 'id', label: '会员ID'}, 
  { value: 'tuijianren.ddusername', label: '推荐人名'}, 
  { value: 'qq', label: 'QQ号码'}, 
  { value: 'alipay', label: '支付宝号码'}, 
  { value: 'email', label: '邮箱'}, 
  { value: 'mobile', label: '手机号码'}, 
  { value: 'realname',label: '姓名'}, 
  { value: 'trade_uid', label: '后六位'}
]
const qujianOptions = [
  { value: 'money', label: '金额'}, 
  { value: 'jifenbao', label: '集分宝'}, 
  { value: 'jifen', label: '积分'}, 
  { value: 'level', label: '购物次数'}, 
  { value: 'loginnum', label: '登陆次数'}
]

//将对象转换成数组
const platformArray = platformOptions.reduce((acc, cur) => {
  acc[cur.value] = cur.label
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
        search: 'del:1;',
        searchFields: 'del:=;',
        orderBy: 'id',
        sortedBy: 'desc',
        //filter: 'id;ddusername;jifenbao;money;tjr;email;platform;qq;regtime;lastlogintime;loginnum;level;jifen;trade_uid;if_lock'
      },
      searchQuery: {
        search: 'del:1;',
        searchFields: 'del:=;',
        field: '',//搜索字段
        keyword: '',//搜索字段对应关键词
        code: '',//搜索板块
        leixing: '',//搜索类型
        cid: '',//搜索分类
        ddusername: '',//搜索会员名
      },
      lockOptions,
      platformOptions,
      fieldOptions,
      qujianOptions,
      multipleSelection: [],
      checkAll: 0,
      isIndeterminate: false,
      dialogFormVisible: false,
      dialogTemp: {
        id: undefined,
        top: '',
        top_stime: '',
        top_etime:''
      }
    }

  },
  filters: {
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
      if (tempData.if_lock) {
        search += 'if_lock:'+ tempData.if_lock + ';'
        tempData.searchFields += 'if_lock:=;'
      }
      if (tempData.platform) {
        search += 'platform:'+ tempData.platform + ';'
        searchFields += 'platform:=;'
      }
      if(tempData.qujian){
        search += tempData.qujian + ':' + tempData.qujian1 + ',' + tempData.qujian2 +';'
        searchFields += tempData.qujian+':between;'       
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
      this.$confirm('此操作将数据彻底删除且不可恢复, 是否继续?', '提示', {
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

</style>