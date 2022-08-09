<template>
  <div class="app-container" v-loading="listLoading" element-loading-text="Loading">
    <div class="filter-container" style="margin-bottom:10px;">
      事件:
      <el-select v-model="searchQuery.shijian" clearable placeholder="全部" style="width:105px;">
        <el-option v-for="(item,index) in mxOptions" :key="index" :label="item.title" :value="index"></el-option>
      </el-select>
      会员名 :
      <el-input style="width: 150px;" class="filter-item" placeholder="会员名" v-model="searchQuery.ddusername" @blur="getUserId">
      </el-input>
      会员ID :
      <el-input style="width: 150px;" class="filter-item" placeholder="会员名" v-model="searchQuery.uid"></el-input>
      月份 :
      <el-date-picker v-model="searchQuery.month" type="month" placeholder="选择月份"></el-date-picker>
      <el-button type="primary" class="filter-item" icon="el-icon-search" @click="handleFilter">筛选</el-button>
    </div>

    <el-table ref="multipleTable" :data="list" size="small" border fit highlight-current-row>
      <el-table-column prop="id" label="ID" width="90"></el-table-column>
      <el-table-column prop="user.ddusername" label="会员" align="center" width="110"></el-table-column>
      <el-table-column prop="source" label="说明" align="center"></el-table-column>
      <!-- <el-table-column prop="jifen" label="积分" width="70"></el-table-column> -->
      <el-table-column prop="shijian_info.title" label="事件" width="100"></el-table-column>
      <el-table-column prop="money" label="奖励金额" width="90" align="center">
        <template slot-scope="scope">
          <b v-if="scope.row.money>0" style="color: green">+{{scope.row.money}}</b>
          <span v-else-if="scope.row.money<0" style="color: red">{{scope.row.money}}</span>
          <span v-else>{{scope.row.money}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="leave_money" label="剩余金额" width="80"></el-table-column>
      <el-table-column prop="jifenbao" label="奖励集分宝" align="center" width="90">
        <template slot-scope="scope">
          <b v-if="scope.row.jifenbao>0" style="color: green">+{{scope.row.jifenbao}}</b>
          <span v-else-if="scope.row.jifenbao<0" style="color: red">{{scope.row.jifenbao}}</span>
          <span v-else>{{scope.row.jifenbao}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="leave_jifenbao" label="剩余集分宝" width="100"></el-table-column>
      <el-table-column prop="addtime" label="时间"  width="150"></el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @current-change="handleCurrentChange" :current-page="listQuery.page"
        :page-sizes="[listQuery.limit]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
import { getList,getShijians,getUserId} from '@/api/mingxilist'
import { parseTime, parseDate} from '@/utils'
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
        search: '',
        searchFields: '',
        orderBy: 'id',
        sortedBy: 'desc',
        filter: ''
      },
      searchQuery: {
        search: '',
        searchFields: '',
        shijian: '',//事件
        uid: '',//会员id
        ddusername: '',//搜索会员名
        month: parseTime(parseDate(new Date()),'{y}-{m}'),//搜索月份
      },
      mxOptions:[],
    }

  },
  //添加后重载列表
  created() {
    if(this.$route.query.uid){
      this.listQuery.search = 'uid:' + this.$route.query.uid + ';'
      this.listQuery.searchFields = 'uid:=;'
      this.searchQuery.uid = this.$route.query.uid
    }
    this.getList()
    this.getShijians()
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
    //获取明细事件
    getShijians(){
      this.listLoading = true
      getShijians().then(res => {
        this.mxOptions = res.data
        this.listLoading = false
      })
    },
    //获取用户id
    getUserId(){
      if(this.searchQuery.ddusername!=''){
        getUserId(this.searchQuery.ddusername).then(res => {
          this.searchQuery.uid = res.data
        })
      }
    },
    //搜索
    handleFilter() {
      //object格式化
      const tempData = Object.assign({}, this.searchQuery)
      
      let search = tempData.search
      let searchFields = tempData.searchFields
      
      if (tempData.shijian) {
        search += 'shijian:'+ tempData.shijian + ';'
        searchFields += 'shijian:=;'
      }
      if (tempData.uid) {
        search += 'uid:'+ tempData.uid + ';'
        searchFields += 'uid:=;'
      }

      this.listQuery.month = parseTime(parseDate(this.searchQuery.month),'{y}-{m}')
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