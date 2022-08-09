<template>
<el-container>
  <el-header class="tit">
    <div class="r_box">
      <ul>
        <li>
          <div class="block">
            <span class="demonstration">月结日期：</span>
            <el-date-picker
              style="width:150px;"
              v-model="searchuserQuery.dataval"
              type="month"
              placeholder="选择日期时间"
              size="small"
              value-format="yyyy-MM">
            </el-date-picker>
          </div>
        </li>
        <li>
          <el-select class="item-choose" v-model="searchuserQuery.orderStatus" size="small" style="width:150px;" clearable placeholder="刷新退款订单状态">
            <el-option v-for="item in DdOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </li>
        <li>
          <el-input style="width:150px;" clearable size="small" placeholder="请输入会员名" v-model="searchuserQuery.usernameval"></el-input>
        </li>
        <li>
          <el-button type="primary" icon="el-icon-search" size="small" @click="searchuser">查询</el-button>
        </li>
      </ul>
    </div>
  </el-header>

  <el-main class="main">

    <el-table 
      border 
      size="small" 
      :data="userlist" 
      v-loading="userlistLoading" 
      highlight-current-row 
      tooltip-effect="dark" 
      style="text-align:center;">
      <el-table-column label="序号" width="80" prop="index" >
      </el-table-column>
      <el-table-column
        prop="time"
        label="月结日期">
      </el-table-column>
      <el-table-column
        prop="user.ddusername"
        label="会员名">
      </el-table-column>
      <el-table-column
        prop="contract.mobile"
        label="手机号">
      </el-table-column>
      <el-table-column
        prop="contract.wechat"
        label="微信号">
      </el-table-column>
      <el-table-column
        prop="contract.account"
        label="阿里妈妈账号">
      </el-table-column>
      <el-table-column
        prop="status"
        label="刷新退款订单状态">
      </el-table-column>
      
    </el-table>
      <div class="tab_foot">

        <div class="block">
          <el-pagination
            background
            @current-change="handleCurrentChange"
            :current-page="listQuery.page"
            :page-size="listQuery.limit"
            layout="total,prev, pager, next, jumper "
            :total="total">
          </el-pagination>
        </div>
      </div>
    </el-main>

</el-container>
</template>

<script>
import { getUserRefundList, } from '@/api/xiaoai'


const DdOptions = [
  { value: '', label: '全部' }, 
  { value: '0', label: '未点击' }, 
  { value: '1', label: '已点击' }, 
  // { value: '2', label: '授权失效'}
]

export default {
  name: 'UserReceiptsDetails',
  data() {
    return {
      DdState:'',
      DdOptions,
      userlist: [], 
      userlistLoading: false,
      total: 0,
      listQuery:{
        page: 1,
        limit:10,
        orderBy: 'id',
        sortedBy: 'asc',
        search:'',
        searchJoin:'and',
        searchFields:'',
      },
      searchuserQuery:{
        dataval:'',//选择的时间值
        orderStatus:'',//选择退款订单状态
        usernameval:'',//会员名
        search: '',
        searchFields: '',
      },
    }
  },
  computed:{
    
  },
  created(){
    this.getUserList();
  },
  methods: {
    getUserList() {
      //会员列表信息
      this.userlistLoading = true
      getUserRefundList(this.listQuery).then(res => {
        // console.log(res.data.data.data);
        if(res.data.code == 200){
          if(res.data.data.data !== ''){
            this.userlist = res.data.data.data
            this.total = res.data.data.total          
             for(let i = 0; i< this.userlist.length ;i++){
              this.userlist[i].index = (res.data.data.current_page != 1 ? res.data.data.current_page * 10-9:1 ) + i
              //刷新退款订单状态
              if(this.userlist[i].status==0){
                this.userlist[i].status='未点击'
              }else if(this.userlist[i].status==1){
                this.userlist[i].status='已点击'
              }
            }
          }
        }
        this.userlistLoading = false
      })
    },
    handleCurrentChange(val) {
      //刷新分页信息
      // console.log(`当前页: ${val}`)
      this.listQuery.page = val;
      this.getUserList();
    },
    searchuser(){
      //查询
      //每次搜索之前先清空上次searchFields的字段
      this.listQuery.searchFields = '';
      // object格式化
      const tempData = Object.assign({}, this.searchuserQuery)
      let search = tempData.search
      let searchFields = tempData.searchFields

      if (tempData.dataval) {
        search += 'time:' + tempData.dataval + '-20;';
        tempData.searchFields += 'time:=;';
      }

      if (tempData.orderStatus !=='') {
        search +='status'+':'+ tempData.orderStatus + ';';
        tempData.searchFields += 'status:=;';
      }

      if (tempData.usernameval !=='') {
        search +='user.ddusername'+':'+ tempData.usernameval + ';';
        tempData.searchFields += 'user.ddusername:=;';
      }

      this.listQuery.search = search
      this.listQuery.searchFields = tempData.searchFields
      this.listQuery.page = 1
      this.getUserList()
    },
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
input {
  padding: 0 10px;
}
.tit {
  position: relative;
  top: 20px;
  padding: 0 0 0 15px;
  .r_box {
    min-width: 900px;
    li {
      float: left;
      margin-right: 10px;
    }
  }
}
.main {
  .tab_foot {
    .shanshu {
      display: inline-block;
      margin-left: 10px; // border-left:1px solid #f5f5f5;  
    }
    .block {
      float: right;
      margin:30px 60px 0 0;
      // display: inline-block;
    }
  }
}
</style>