<template>
<el-container>
  <el-header class="tit">
    <div class="r_box">
      <ul>
        <li>
          <el-select class="item-choose" v-model="searchuserQuery.jnvalue" size="small" style="width:125px;" clearable placeholder="缴纳状态">
            <el-option v-for="item in jnOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
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
      <!-- <el-table-column label="id" width="70" prop="id" sortable="custom"> -->
        <!-- <template slot-scope="scope">{{ scope.row.id }}</template>-->
      </el-table-column>
      <el-table-column
        prop="ddusername"
        label="会员名"
        min-width="70">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="手机号">
      </el-table-column>
      <el-table-column
        prop="wechat"
        label="微信号"
        min-width="70">
      </el-table-column>
      <el-table-column
        prop="account"
        label="阿里妈妈账号"
        min-width="105">
      </el-table-column>
      <el-table-column
        prop="pid"
        label="PID">
      </el-table-column>
      <el-table-column
        prop="AccountExec"
        label="授权状态">
      </el-table-column>
      <el-table-column
        prop="receivable"
        label="应收金额"
        min-width="85">
      </el-table-column>
      <el-table-column
        prop="already_money"
        label="已收金额">
      </el-table-column>
      <el-table-column
        prop="re_money"
        label="未收金额"
        >
      </el-table-column>
      <el-table-column
        prop="Jn_status"
        label="缴纳状态"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="beizhu"
        label="支付宝备注"
        min-width="70">
      </el-table-column>
      <el-table-column
        prop="reasonState"
        label="冻结状态"
        min-width="70">
      </el-table-column>
      <el-table-column
        prop="reason"
        label="冻结原因"
        min-width="70">
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="100">
          <div slot-scope="scope">
            <el-button type="text" size="small" @click="dongjie(scope.$index,scope.row)"  v-if="scope.row.reasonState !=='已冻结'">冻结</el-button>
            <el-button type="text" size="small" @click="jiedong(scope.$index,scope.row)"  v-if="scope.row.reasonState !==''">解冻</el-button>
          </div>
      </el-table-column>
      
    </el-table>
      <div class="tab_foot">

        <div class="block">
          <el-pagination
            background
            @current-change="handleCurrentChange"
            :current-page="listQuery.page"
            :page-size="listQuery.pagesize"
            layout="prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </el-main>

</el-container>
</template>

<script>
import { parseTime, parseDate } from '@/utils'
import { getAliMMuserList,getUserFrozenThawList } from '@/api/xiaoai'
const jnOptions = [
  { value: '', label: '全部' }, 
  { value: '1', label: '已缴纳' }, 
  { value: '2', label: '未缴纳' }, 
  { value: '3', label: '已逾期' }, 
]

export default {
  name: 'UserAccountList',
  data() {
    return {
      userlist:[], 
      userlistLoading: false,
      total: 0,
      jnOptions,
      listQuery:{
        page:1,//页码
        pagesize:10,//会员名
        user: '',
        jiaonaStatus:'',//1 已缴纳 2未缴纳 3已逾期
      },
      searchuserQuery:{
        jnvalue:'',//缴纳
        usernameval:'',//会员名
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
      getAliMMuserList(this.listQuery).then(res => {
        // console.log(res);
        if(res.data.code == 200){
          if(res.data.data.data !== ''){
            this.userlist = res.data.data.items
            this.total = res.data.data.total          
             for(let i = 0; i< this.userlist.length ;i++){
              //序号
              this.userlist[i].index = (res.data.data.currentPage != 1 ? res.data.data.currentPage * 10-9:1 ) + i;

              //授权状态判断 AccountExec 大于29天 授权失效 小于 已授权 没有这个字段 未授权
              // 获取数据的日期，时间戳 parseDate(this.userlist[i].time) 29天的时间戳2505600
              if(this.userlist[i].time !== null){
                if( parseDate(this.userlist[i].time) + 2505600 > parseDate(new Date()) ){
                  this.userlist[i].AccountExec = '已授权'
                }else if( parseDate(this.userlist[i].time) + 2505600 < parseDate(new Date()) ){
                  this.userlist[i].AccountExec = '授权失效'
                }
              }else{
                this.userlist[i].AccountExec = '未授权'
              }

              //Jn_status 缴纳
              if(this.userlist[i].receivable == this.userlist[i].already_money ){
                this.userlist[i].Jn_status = '已缴纳' 
              }
              if(this.userlist[i].receivable > this.userlist[i].already_money && this.userlist[i].penalty == 0){
                this.userlist[i].Jn_status = '未缴纳'
              }
              if( this.userlist[i].penalty > 0){
                this.userlist[i].Jn_status = '已逾期'
              }

              //reasonState 冻结详情
              if(this.userlist[i].if_ok !== null ){
                if( this.userlist[i].if_ok == 0){
                  this.userlist[i].reasonState = '已冻结';
                }else{
                  this.userlist[i].reasonState = '';
                  this.userlist[i].reason = '';
                }
              }else{
                this.userlist[i].reason = '';
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
    //操作 冻结 type2
    dongjie(index, row){
      this.$prompt('请输入冻结该账号的原因', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern:/\S/,
          inputErrorMessage: '内容不能为空',
        }).then(({ value }) => {
          let params={
            type:2,
            id:row.id,
            reason:value,
          }
          getUserFrozenThawList(params).then(res => {
            // console.log(res);
            if(res.data.code == 200){
              this.$message({
                type: 'success',
                message: '冻结成功!'
              });
              this.getUserList(); 
            }else{
              this.$message({
                type: 'error',
                message: res.data.msg
              });
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '操作已取消'
          });
        });
    },
    //操作 解冻 1
    jiedong(index, row){
      // console.log(row);
      
      this.$confirm('是否解冻该账号?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params={
          type:1,
          id:row.id,
          reason:row.reason,
        };
        getUserFrozenThawList(params).then(res => {
          // console.log(res);
          if(res.data.code == 200){
            this.$message({
              type: 'success',
              message: '解冻成功!'
            });
            this.getUserList(); 
          }else{
            this.$message({
              type: 'error',
              message: res.data.msg
            });
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作取消!'
        });
      });
    },
    searchuser(){
      //查询
      this.listQuery.user =  this.searchuserQuery.usernameval;//会员名
      this.listQuery.jiaonaStatus = this.searchuserQuery.jnvalue;//缴纳
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