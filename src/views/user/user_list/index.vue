<template>
  <div class="app-container" v-loading="listLoading" element-loading-text="Loading">
    <div class="filter-container" style="margin-bottom:10px;">
      <el-select class="item-choose" v-model="searchQuery.if_lock" size="small" style="width:105px;" clearable placeholder="状态">
        <el-option v-for="item in lockOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-select v-model="searchQuery.platform" clearable placeholder="来源" style="width:105px;">
        <el-option v-for="item in platformOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-select v-model="searchQuery.field" clearable placeholder="搜索字段" style="width:105px;">
        <el-option v-for="item in fieldOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      :
      <el-input style="width: 150px;" class="filter-item" placeholder="关键字" v-model="searchQuery.keyword"></el-input>

      <el-select class="item-choose" v-model="searchQuery.qujian" size="small" style="width:105px;" clearable placeholder="金额">
        <el-option v-for="item in qujianOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-input style="width: 150px;" class="filter-item" placeholder="开始值" v-model="searchQuery.qujian1"></el-input>
      -
      <el-input style="width: 150px;" class="filter-item" placeholder="结束值" v-model="searchQuery.qujian2"></el-input>
      <el-select v-model="searchQuery.orderBy" clearable placeholder="排序" style="width:105px;">
        <el-option v-for="item in fieldOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-select v-model="searchQuery.sortedBy" clearable placeholder="排序方式" style="width:105px;">
        <el-option v-for="item in sortedOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>

      <el-button type="primary" class="filter-item" icon="el-icon-search" @click="handleFilter">筛选</el-button>
      <router-link :to="'/user/user-reycle'">
        <el-button type="text">【回收站】</el-button>
      </router-link>
    </div>

    <el-table ref="multipleTable" size="small" :data="list" @selection-change="handleSelectionChange" border fit highlight-current-row>
      <el-table-column type="selection" width="35"></el-table-column>
      <el-table-column label="id" width="80" prop="id" sortable="custom"></el-table-column>
      <el-table-column prop="platform" label="来源" min-width="50">
        <template slot-scope="scope">{{scope.row.platform|platformFilter}}</template>
      </el-table-column>
      <el-table-column prop="ddusername" label="用户名"> </el-table-column>
      <el-table-column prop="tjr" label="推荐ID"> </el-table-column>
      <el-table-column prop="tuijianren.ddusername" label="推荐人用户名"> </el-table-column>
      <!-- <el-table-column prop="email" label="邮箱"></el-table-column> -->
      <el-table-column label="QQ">
        <template slot-scope="scope">
          <a target="_blank" :href="'http://wpa.qq.com/msgrd?v=3&uin=' + scope.row.qq +'&site=qq&menu=yes'" >
          <img style="height:16px" border="0" src="http://wpa.qq.com/pa?p=2:66666:46" alt="点击这里给我发消息" title="点击这里给我发消息">
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="regtime" label="注册时间" min-width="120"> </el-table-column>
      <el-table-column prop="haoyous_count" label="好友圈"></el-table-column>
      <el-table-column prop="youxiaos_count" label="有效会员"> </el-table-column>
      <el-table-column label="合并有效" min-width="75"> 
        <div slot-scope="scope">
          <el-button type="text" size="small" v-if="scope.row.youxiao_total===-1" @click="handleYouxiao(scope.row)">查看</el-button>
          <span v-else>{{scope.row.youxiao_total}}</span>
        </div>
      </el-table-column>
      <el-table-column prop="lastlogintime" label="最近登陆" min-width="120"></el-table-column>
      <el-table-column prop="loginnum" label="登录次数" sortable></el-table-column>
      <el-table-column prop="level" label="购物次数" sortable> </el-table-column>
      <el-table-column prop="money" label="金额" sortable> </el-table-column>
      <el-table-column prop="jifenbao" label="集分宝" sortable> </el-table-column>
      <el-table-column prop="trade_uid" label="后六位" min-width="75"> </el-table-column>
      <el-table-column label="操作" min-width="175">
          <div slot-scope="scope">
            <router-link :to="'/user/user-edit/'+scope.row.id">
              <el-button type="text" size="small">查看</el-button>
            </router-link>
            <router-link :to="{path:'/user/mingxi_list', query:{uid:scope.row.id}}">
              <el-button type="text" size="small">明细</el-button>
            </router-link>
            <router-link :to="'/user/tuijianren/'+scope.row.id">
              <el-button type="text" size="small"><font color="brown" title="修改推荐人">改推</font></el-button>
            </router-link>
            <el-button type="text" size="small" @click="handleJifenbao(scope.row)"><font color="orange" title="集分宝增减">奖扣</font></el-button>
            <el-button type="text" v-if="scope.row.if_lock==-1" size="mini" @click="handleLockStatus(scope.row,'0')"><font color="green" title="取消黑名单">拉白</font></el-button>
            <el-button type="text" v-else size="mini" @click="handleLockStatus(scope.row,'-1')"><font color="red" title="拉入黑名单">拉黑</font></el-button>
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

    <el-dialog title="集分宝奖扣设置" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" size="small" ref="dataForm" :model="dialogTemp" label-position="left" label-width="90px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="用户" prop="ddusername">{{dialogTemp.ddusername}}</el-form-item>
        <el-form-item label="现有集分宝" prop="jifenbao">{{dialogTemp.jifenbao}}</el-form-item>
        <el-form-item label="操作" prop="is_add">
          <el-radio-group v-model="dialogTemp.is_add">
            <el-radio :label="1">增加</el-radio>
            <el-radio :label="0">扣减</el-radio>
          </el-radio-group>
          <el-input style="width: 100px; margin-left: 10px;" placeholder="集分宝" v-model="dialogTemp.jfb"></el-input>分
        </el-form-item>
        <el-form-item label="明细" prop="is_mingxi">
          <el-radio-group v-model="dialogTemp.is_mingxi">
            <el-radio :label="1">生成</el-radio>
            <el-radio :label="0">不生成</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="jifenbaoData">执行</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getList,updateData,delData,fetchData,getYouxiao } from '@/api/userlist'
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
const sortedOptions = [
  { value: 'asc', label: '正序'}, 
  { value: 'desc', label: '倒序'}, 
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
        search: 'del:0;',
        searchFields: 'del:=;',
        orderBy: 'id',
        sortedBy: 'desc',
        //filter: 'id;ddusername;jifenbao;money;tjr;email;platform;qq;regtime;lastlogintime;loginnum;level;jifen;trade_uid;if_lock'
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
        orderBy: 'id',
        sortedBy: 'desc',
      },
      lockOptions,
      platformOptions,
      fieldOptions,
      qujianOptions,
      sortedOptions,
      multipleSelection: [],
      checkAll: 0,
      isIndeterminate: false,
      dialogFormVisible: false,
      dialogTemp: {
        id: undefined,
        ddusername: '',
        jifenbao: 0,
        is_add: 1,
        is_mingxi: 0,
        jfb:0,
      },
      rules: {
        jfb: [{ required: true, message: '请输入集分宝', trigger: 'blur' }],
        //top_stime: [{ type: 'date', required: true, message: '请选择开始时间', trigger: 'change' }],
        //top_etime: [{ type: 'date', required: true, message: '请选择结束时间', trigger: 'change' }]
      },
    }

  },
  computed:{
    qqSrc(){
      return 'http://wpa.qq.com/msgrd?v=3&uin=' + this.list.qq +'&site=qq&menu=yes'
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
        for (var i = this.list.length - 1; i >= 0; i--) {
          this.list[i].youxiao_total = -1
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
      this.listQuery.orderBy = tempData.orderBy
      this.listQuery.sortedBy = tempData.sortedBy
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
        delData(ids).then(response => {
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
    //拉黑状态修改
    handleLockStatus(row, status){
      updateData({if_lock:status},row.id).then(response => {
        this.$message({
          type: 'success',
          message: response.data.message
        })
        row.if_lock = status
      })
    },
    //获取合并后有效会员
    handleYouxiao(row){
      getYouxiao(row.id).then(response => {
        // for (var i = this.list.length - 1; i >= 0; i--) {
        //   //重置积分金额
        //   if (this.list[i].id === row.id) {
        //     this.list[i].youxiao_total = 999//response.data
        //     //this.list[i].jifenbao = 888
        //   }
        // }
        row.youxiao_total = response.data
        row.qq = null
        //row.jifenbao = 888
      })
    },
    //奖励调出
    handleJifenbao(row) {
      this.resetTemp(row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    //执行奖励
    jifenbaoData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          const tempData = Object.assign({}, this.dialogTemp)
          updateData(tempData,tempData.id).then(response => {
            //console.log(response)
            for (var i = this.list.length - 1; i >= 0; i--) {
              //重置积分金额
              if (this.list[i].id === this.dialogTemp.id) {
                this.list[i].jifenbao = response.data.jifenbao
              }
            }
            this.dialogFormVisible = false
            this.listLoading = false
            this.$notify({
              title: '提示',
              message: response.data.message,
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
        ddusername: arr.ddusername,
        jifenbao: arr.jifenbao,
        is_add: 1,
        is_mingxi: 0,
        jfb:0,
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